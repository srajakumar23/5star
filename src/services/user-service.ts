import prisma from "@/lib/prisma"
import { BaseService, ServiceResult, AppError } from "./base-service"
import { UserRole, AccountStatus, User } from "@prisma/client"
import { generateSmartReferralCode } from "@/lib/referral-service"
import { logAction } from "@/lib/audit-logger"
import { EmailService } from "@/lib/email-service"

export class UserService extends BaseService {

    async getAllUsers(scopeFilter: any): Promise<ServiceResult<any[]>> {
        try {
            const users = await prisma.user.findMany({
                where: scopeFilter,
                select: {
                    userId: true,
                    fullName: true,
                    mobileNumber: true,
                    role: true,
                    assignedCampus: true,
                    campusId: true,
                    grade: true,
                    studentFee: true,
                    status: true,
                    confirmedReferralCount: true,
                    referralCode: true,
                    createdAt: true,
                    empId: true
                },
                orderBy: { createdAt: 'desc' }
            })

            // Fetch all campuses to map IDs to Names
            const campuses = await prisma.campus.findMany({ select: { id: true, campusName: true } })
            const campusMap = new Map(campuses.map(c => [c.id, c.campusName]))

            const mappedUsers = users.map(u => ({
                ...u,
                assignedCampus: u.assignedCampus || (u.campusId ? campusMap.get(u.campusId) || null : null),
                referralCount: u.confirmedReferralCount
            }))

            return { success: true, data: mappedUsers }
        } catch (error) {
            return this.handleError(error, 'UserService.getAllUsers')
        }
    }

    async addUser(data: {
        fullName: string
        mobileNumber: string
        role: UserRole
        childInAchariya?: boolean
        childName?: string | null
        assignedCampus?: string | null
    }, adminId?: string): Promise<ServiceResult<User>> {
        try {
            // Check if mobile number already exists
            const existing = await prisma.user.findUnique({
                where: { mobileNumber: data.mobileNumber }
            })

            if (existing) {
                return { success: false, error: 'Mobile number already registered' }
            }

            // Generate Smart Referral Code
            const referralCode = await generateSmartReferralCode(data.role)

            const newUser = await prisma.user.create({
                data: {
                    fullName: data.fullName,
                    mobileNumber: data.mobileNumber,
                    role: data.role,
                    referralCode,
                    childInAchariya: data.childInAchariya || false,
                    childName: data.childName || null,
                    assignedCampus: data.assignedCampus || null,
                    status: 'Active',
                    yearFeeBenefitPercent: 0,
                    longTermBenefitPercent: 0,
                    confirmedReferralCount: 0,
                    isFiveStarMember: false
                }
            })

            await logAction('CREATE', 'user', `Created new user: ${data.mobileNumber}`, newUser.userId.toString(), null, { role: data.role, createdBy: adminId })

            // Send Welcome Email
            await EmailService.sendWelcomeEmail(data.mobileNumber, data.fullName, data.role)

            return { success: true, data: newUser }
        } catch (error) {
            return this.handleError(error, 'UserService.addUser')
        }
    }

    async updateUser(userId: number, data: {
        fullName?: string
        mobileNumber?: string
        role?: UserRole
        assignedCampus?: string | null
        empId?: string
        childEprNo?: string
        isFiveStarMember?: boolean
        yearFeeBenefitPercent?: number
        longTermBenefitPercent?: number
        status?: AccountStatus
    }, adminId?: string): Promise<ServiceResult<User>> {
        try {
            const previousUser = await prisma.user.findUnique({ where: { userId } })
            if (!previousUser) throw new AppError('User not found')

            const updatedUser = await prisma.user.update({
                where: { userId },
                data: { ...data }
            })

            await logAction('UPDATE', 'user', `Updated user: ${userId}`, userId.toString(), null, {
                previous: previousUser,
                next: updatedUser,
                updatedBy: adminId
            })

            return { success: true, data: updatedUser }
        } catch (error) {
            return this.handleError(error, 'UserService.updateUser')
        }
    }

    async deleteUser(userId: number, adminId?: string): Promise<ServiceResult<User>> {
        try {
            const previousUser = await prisma.user.findUnique({ where: { userId } })
            if (!previousUser) throw new AppError('User not found')

            // Delete all referrals first due to foreign key constraint
            await prisma.referralLead.deleteMany({
                where: { userId }
            })

            const deletedUser = await prisma.user.delete({
                where: { userId }
            })

            await logAction('DELETE', 'user', `Deleted user: ${userId}`, userId.toString(), null, { deletedUser, deletedBy: adminId })

            return { success: true, data: deletedUser }

        } catch (error) {
            return this.handleError(error, 'UserService.deleteUser')
        }
    }

    async assignToCampus(userId: number, campus: string | null, adminId?: string): Promise<ServiceResult<User>> {
        try {
            const previousUser = await prisma.user.findUnique({ where: { userId } })
            if (!previousUser) throw new AppError('User not found')

            const updatedUser = await prisma.user.update({
                where: { userId },
                data: { assignedCampus: campus }
            })

            await logAction('UPDATE', 'user', `Assigned user ${userId} to campus: ${campus}`, userId.toString(), null, { previous: previousUser, next: updatedUser, assignedBy: adminId })

            return { success: true, data: updatedUser }
        } catch (error) {
            return this.handleError(error, 'UserService.assignToCampus')
        }
    }
    async toggleStatus(userId: number, status: AccountStatus, adminId?: string): Promise<ServiceResult<User>> {
        try {
            const previousUser = await prisma.user.findUnique({ where: { userId } })
            if (!previousUser) throw new AppError('User not found')

            const updatedUser = await prisma.user.update({
                where: { userId },
                data: { status }
            })

            await logAction('UPDATE', 'user', `Changed user ${userId} status to ${status}`, userId.toString(), null, {
                previousStatus: previousUser.status,
                newStatus: status,
                updatedBy: adminId
            })

            return { success: true, data: updatedUser }
        } catch (error) {
            return this.handleError(error, 'UserService.toggleStatus')
        }
    }
}

export const userService = new UserService()
