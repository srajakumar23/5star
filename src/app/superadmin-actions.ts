'use server'

import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth-service"

// Type definitions
type Campus = string
type Role = 'Staff' | 'Parent'
type LeadStatus = 'New' | 'Follow-up' | 'Confirmed'

interface SystemAnalytics {
    totalAmbassadors: number
    totalLeads: number
    totalConfirmed: number
    globalConversionRate: number
    totalCampuses: number
    systemWideBenefits: number
    totalStudents: number
    staffCount: number
    parentCount: number
}

interface CampusComparison {
    campus: string
    totalLeads: number
    confirmed: number
    pending: number
    conversionRate: number
    ambassadors: number
}

interface UserRecord {
    userId: number
    fullName: string
    mobileNumber: string
    role: string
    assignedCampus: string | null
    campusId: number | null
    grade: string | null
    studentFee: number
    status: string
    referralCount: number
    createdAt: Date
}

export async function getSystemAnalytics(): Promise<SystemAnalytics> {
    const user = await getCurrentUser()
    if (!user || !user.role.includes('Super Admin')) {
        throw new Error('Unauthorized')
    }

    const totalAmbassadors = await prisma.user.count()

    const totalLeads = await prisma.referralLead.count()

    const totalConfirmed = await prisma.referralLead.count({
        where: { leadStatus: 'Confirmed' }
    })

    const globalConversionRate = totalLeads > 0
        ? (totalConfirmed / totalLeads) * 100
        : 0

    // Get unique campuses
    const campuses = await prisma.referralLead.findMany({
        where: { campus: { not: null } },
        select: { campus: true },
        distinct: ['campus']
    })

    const totalCampuses = campuses.length

    // Calculate system-wide benefits (simplified)
    const users = await prisma.user.findMany({
        select: {
            studentFee: true,
            yearFeeBenefitPercent: true,
            confirmedReferralCount: true
        }
    })

    const systemWideBenefits = users.reduce((acc, user) => {
        return acc + (user.studentFee * (user.yearFeeBenefitPercent / 100) * user.confirmedReferralCount)
    }, 0)

    const totalStudents = await prisma.student.count()

    const staffCount = await prisma.user.count({
        where: { role: 'Staff' }
    })

    const parentCount = await prisma.user.count({
        where: { role: 'Parent' }
    })

    return {
        totalAmbassadors,
        totalLeads,
        totalConfirmed,
        globalConversionRate: Number(globalConversionRate.toFixed(2)),
        totalCampuses,
        systemWideBenefits: Math.round(systemWideBenefits),
        totalStudents,
        staffCount,
        parentCount
    }
}

export async function getCampusComparison(): Promise<CampusComparison[]> {
    const user = await getCurrentUser()
    if (!user || !user.role.includes('Super Admin')) {
        throw new Error('Unauthorized')
    }

    // Get all campuses
    const campuses = await prisma.referralLead.findMany({
        where: { campus: { not: null } },
        select: { campus: true },
        distinct: ['campus']
    })

    const comparison: CampusComparison[] = []

    for (const { campus } of campuses) {
        if (!campus) continue

        const totalLeads = await prisma.referralLead.count({
            where: { campus }
        })

        const confirmed = await prisma.referralLead.count({
            where: { campus, leadStatus: 'Confirmed' }
        })

        const pending = await prisma.referralLead.count({
            where: { campus, leadStatus: { in: ['New', 'Follow-up'] } }
        })

        const conversionRate = totalLeads > 0
            ? (confirmed / totalLeads) * 100
            : 0

        // Count unique ambassadors for this campus
        const ambassadorIds = await prisma.referralLead.findMany({
            where: { campus },
            select: { userId: true },
            distinct: ['userId']
        })

        comparison.push({
            campus,
            totalLeads,
            confirmed,
            pending,
            conversionRate: Number(conversionRate.toFixed(2)),
            ambassadors: ambassadorIds.length
        })
    }

    // Sort by total leads descending
    return comparison.sort((a, b) => b.totalLeads - a.totalLeads)
}

export async function getAllUsers(): Promise<UserRecord[]> {
    const user = await getCurrentUser()
    if (!user || !user.role.includes('Super Admin')) {
        throw new Error('Unauthorized')
    }

    const users = await prisma.user.findMany({
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
            createdAt: true
        },
        orderBy: { createdAt: 'desc' }
    })

    return users.map(u => ({
        ...u,
        referralCount: u.confirmedReferralCount
    }))
}

export async function getAllAdmins() {
    const user = await getCurrentUser()
    if (!user || !user.role.includes('Super Admin')) {
        throw new Error('Unauthorized')
    }

    return await prisma.admin.findMany({
        orderBy: { createdAt: 'desc' }
    })
}

export async function getAllStudents() {
    const user = await getCurrentUser()
    if (!user || !user.role.includes('Super Admin')) {
        throw new Error('Unauthorized')
    }

    return await prisma.student.findMany({
        include: {
            parent: { select: { fullName: true, mobileNumber: true } },
            campus: { select: { campusName: true } }
        },
        orderBy: { createdAt: 'desc' }
    })
}

export async function assignUserToCampus(userId: number, campus: string | null) {
    const user = await getCurrentUser()
    if (!user || !user.role.includes('Super Admin')) {
        throw new Error('Unauthorized')
    }

    return await prisma.user.update({
        where: { userId },
        data: { assignedCampus: campus }
    })
}

export async function updateAdminRole(adminId: number, role: string, campus: string | null) {
    const user = await getCurrentUser()
    if (!user || !user.role.includes('Super Admin')) {
        throw new Error('Unauthorized')
    }

    return await prisma.admin.update({
        where: { adminId },
        data: {
            role,
            assignedCampus: campus
        }
    })
}

export async function deleteUser(userId: number) {
    const user = await getCurrentUser()
    if (!user || !user.role.includes('Super Admin')) {
        throw new Error('Unauthorized')
    }

    // Delete all referrals first due to foreign key constraint
    await prisma.referralLead.deleteMany({
        where: { userId }
    })

    return await prisma.user.delete({
        where: { userId }
    })
}

// Generate unique referral code
function generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = 'ACH'
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
}

// ===================== ADD USER =====================
export async function addUser(data: {
    fullName: string
    mobileNumber: string
    role: 'Parent' | 'Staff'
    childInAchariya?: string
    childName?: string
    assignedCampus?: string
}) {
    const admin = await getCurrentUser()
    if (!admin || !admin.role.includes('Admin')) {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        // Check if mobile number already exists
        const existing = await prisma.user.findUnique({
            where: { mobileNumber: data.mobileNumber }
        })

        if (existing) {
            return { success: false, error: 'Mobile number already registered' }
        }

        // Generate unique referral code
        let referralCode = generateReferralCode()
        let attempts = 0
        while (await prisma.user.findFirst({ where: { referralCode } }) && attempts < 10) {
            referralCode = generateReferralCode()
            attempts++
        }

        const newUser = await prisma.user.create({
            data: {
                fullName: data.fullName,
                mobileNumber: data.mobileNumber,
                role: data.role,
                referralCode,
                childInAchariya: data.childInAchariya === 'Yes',
                childName: data.childName || null,
                assignedCampus: data.assignedCampus || null,
                status: 'Active',
                yearFeeBenefitPercent: 0,
                longTermBenefitPercent: 0,
                confirmedReferralCount: 0,
                isFiveStarMember: false
            }
        })

        return { success: true, user: newUser }
    } catch (error) {
        console.error('Add user error:', error)
        return { success: false, error: 'Failed to add user' }
    }
}

// ===================== DELETE USER (with return object) =====================
export async function removeUser(userId: number) {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Only Super Admin can delete users' }
    }

    try {
        await prisma.referralLead.deleteMany({ where: { userId } })
        await prisma.user.delete({ where: { userId } })
        return { success: true }
    } catch (error) {
        console.error('Delete user error:', error)
        return { success: false, error: 'Failed to delete user' }
    }
}

// ===================== BULK ADD USERS =====================
export async function bulkAddUsers(users: Array<{
    fullName: string
    mobileNumber: string
    role: 'Parent' | 'Staff'
    assignedCampus?: string
}>) {
    const admin = await getCurrentUser()
    if (!admin || !admin.role.includes('Admin')) {
        return { success: false, error: 'Unauthorized', added: 0, failed: 0 }
    }

    let added = 0
    let failed = 0
    const errors: string[] = []

    for (const userData of users) {
        try {
            const existing = await prisma.user.findUnique({
                where: { mobileNumber: userData.mobileNumber }
            })

            if (existing) {
                failed++
                errors.push(`${userData.mobileNumber}: Already exists`)
                continue
            }

            let referralCode = generateReferralCode()
            while (await prisma.user.findFirst({ where: { referralCode } })) {
                referralCode = generateReferralCode()
            }

            await prisma.user.create({
                data: {
                    fullName: userData.fullName,
                    mobileNumber: userData.mobileNumber,
                    role: userData.role,
                    referralCode,
                    childInAchariya: false,
                    assignedCampus: userData.assignedCampus || null,
                    status: 'Active',
                    yearFeeBenefitPercent: 0,
                    longTermBenefitPercent: 0,
                    confirmedReferralCount: 0,
                    isFiveStarMember: false
                }
            })
            added++
        } catch {
            failed++
            errors.push(`${userData.mobileNumber}: Failed to add`)
        }
    }

    return { success: true, added, failed, errors }
}

// ===================== ADD ADMIN =====================
export async function addAdmin(data: {
    adminName: string
    adminMobile: string
    role: 'CampusHead' | 'CampusAdmin'
    assignedCampus: string
    password?: string
}) {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Only Super Admin can add admins' }
    }

    try {
        const existing = await prisma.admin.findUnique({
            where: { adminMobile: data.adminMobile }
        })

        if (existing) {
            return { success: false, error: 'Mobile number already registered for admin' }
        }

        const newAdmin = await prisma.admin.create({
            data: {
                adminName: data.adminName,
                adminMobile: data.adminMobile,
                role: data.role,
                assignedCampus: data.assignedCampus
            }
        })

        return { success: true, admin: newAdmin }
    } catch (error) {
        console.error('Add admin error:', error)
        return { success: false, error: 'Failed to add admin' }
    }
}

// ===================== DELETE ADMIN =====================
export async function deleteAdmin(adminId: number) {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Only Super Admin can delete admins' }
    }

    if ('adminId' in admin && admin.adminId === adminId) {
        return { success: false, error: 'Cannot delete yourself' }
    }

    try {
        await prisma.admin.delete({ where: { adminId } })
        return { success: true }
    } catch (error) {
        console.error('Delete admin error:', error)
        return { success: false, error: 'Failed to delete admin' }
    }
}

// ===================== BULK ADD ADMINS =====================
export async function bulkAddAdmins(admins: Array<{
    adminName: string
    adminMobile: string
    role: 'CampusHead' | 'CampusAdmin'
    assignedCampus: string
}>) {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Only Super Admin can bulk add admins', added: 0, failed: 0 }
    }

    let added = 0
    let failed = 0
    const errors: string[] = []

    for (const adminData of admins) {
        try {
            const existing = await prisma.admin.findUnique({
                where: { adminMobile: adminData.adminMobile }
            })

            if (existing) {
                failed++
                errors.push(`${adminData.adminMobile}: Already exists`)
                continue
            }

            await prisma.admin.create({
                data: {
                    adminName: adminData.adminName,
                    adminMobile: adminData.adminMobile,
                    role: adminData.role,
                    assignedCampus: adminData.assignedCampus
                }
            })
            added++
        } catch {
            failed++
            errors.push(`${adminData.adminMobile}: Failed to add`)
        }
    }

    return { success: true, added, failed, errors }
}

// ===================== UPDATE USER STATUS =====================
export async function updateUserStatus(userId: number, status: 'Active' | 'Inactive') {
    const admin = await getCurrentUser()
    if (!admin || !admin.role.includes('Admin')) {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        await prisma.user.update({
            where: { userId },
            data: { status }
        })
        return { success: true }
    } catch (error) {
        console.error('Update user status error:', error)
        return { success: false, error: 'Failed to update status' }
    }
}

// ===================== UPDATE ADMIN STATUS =====================
export async function updateAdminStatus(adminId: number, status: 'Active' | 'Inactive') {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Only Super Admin can update admin status' }
    }

    try {
        await prisma.admin.update({
            where: { adminId },
            data: { status }
        })
        return { success: true }
    } catch (error) {
        console.error('Update admin status error:', error)
        return { success: false, error: 'Failed to update status' }
    }
}
