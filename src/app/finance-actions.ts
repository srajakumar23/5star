'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-service'
import { EmailService } from '@/lib/email-service'
import { logAction } from '@/lib/audit-logger'
import { revalidatePath } from 'next/cache'
import { decrypt } from '@/lib/encryption'

// --- Registration Transactions ---

export async function getRegistrationTransactions(filter: 'All' | 'Recent' = 'All') {
    const admin = await getCurrentUser()
    if (!admin) return { success: false, error: 'Unauthorized' }

    try {
        // Build where clause
        const where: any = {
            OR: [
                { paymentStatus: 'Completed' },
                { transactionId: { not: null } }
            ]
        }

        // Campus Head restriction
        if (admin.role.includes('Campus') && (admin as any).campusId) {
            where.campusId = (admin as any).campusId
        }

        const transactions = await prisma.user.findMany({
            where,
            select: {
                userId: true,
                fullName: true,
                role: true,
                mobileNumber: true,
                paymentAmount: true,
                transactionId: true,
                createdAt: true,
                assignedCampus: true,
                referralCode: true
            },
            orderBy: { createdAt: 'desc' },
            take: filter === 'Recent' ? 10 : 1000
        })

        return { success: true, data: transactions }
    } catch (error) {
        console.error('Error fetching registration transactions:', error)
        return { success: false, error: 'Failed to fetch transactions' }
    }
}


export async function getSettlements(status: string = 'Pending') {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    try {
        const whereClause: any = {}
        if (status !== 'All') {
            whereClause.status = status
        }

        // Campus Head restriction
        if (user.role.includes('Campus') && (user as any).campusId) {
            const userIdList = await prisma.user.findMany({
                where: { campusId: (user as any).campusId },
                select: { userId: true }
            })
            const userIds = userIdList.map(u => u.userId)
            whereClause.userId = { in: userIds }
        }

        const settlements = await prisma.settlement.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        fullName: true,
                        role: true,
                        mobileNumber: true,
                        bankAccountDetails: true,
                        referralCode: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // Decrypt bank details before returning
        const decryptedSettlements = settlements.map(s => ({
            ...s,
            user: {
                ...s.user,
                bankAccountDetails: s.user.bankAccountDetails ? decrypt(s.user.bankAccountDetails) : null
            }
        }))

        return { success: true, data: decryptedSettlements }
    } catch (error) {
        console.error('Get Settlements Error:', error)
        return { success: false, error: 'Failed to fetch settlements' }
    }
}

export async function getFinanceStats() {
    const admin = await getCurrentUser()
    if (!admin) return { success: false, error: 'Unauthorized' }

    try {
        const whereSettlement: any = {}
        const whereUser: any = {
            OR: [
                { paymentStatus: 'Completed' },
                { transactionId: { not: null } }
            ]
        }

        if (admin.role.includes('Campus') && (admin as any).campusId) {
            // Fetch users in this campus to filter settlements
            const campusUsers = await prisma.user.findMany({
                where: { campusId: (admin as any).campusId },
                select: { userId: true }
            })
            const userIds = campusUsers.map(u => u.userId)
            whereSettlement.userId = { in: userIds }
            whereUser.campusId = (admin as any).campusId
        }

        const [pending, processedCount, totalCount, revenueAgg] = await Promise.all([
            prisma.settlement.aggregate({
                where: { status: 'Pending', ...whereSettlement },
                _sum: { amount: true }
            }),
            prisma.settlement.aggregate({
                where: { status: 'Processed', ...whereSettlement },
                _sum: { amount: true }
            }),
            prisma.settlement.count({ where: whereSettlement }),
            prisma.user.aggregate({
                where: whereUser,
                _sum: { paymentAmount: true }
            })
        ])

        return {
            success: true,
            stats: {
                pending: pending._sum.amount || 0,
                processed: processedCount._sum.amount || 0,
                totalCount,
                totalRevenue: revenueAgg._sum.paymentAmount || 0
            }
        }
    } catch (error) {
        return { success: false, error: 'Failed to fetch stats' }
    }
}

export async function processPayout(settlementId: number, transactionId: string, remarks?: string) {
    const admin = await getCurrentUser()
    if (!admin) return { success: false, error: 'Unauthorized' }

    try {
        // 1. Update Settlement
        const settlement = await prisma.settlement.update({
            where: { id: settlementId },
            data: {
                status: 'Processed',
                bankReference: transactionId,
                remarks: remarks || 'Processed via Admin Portal',
                processedBy: Number(admin.userId), // explicit casting if needed, though schema might use adminId differently.
                // Note: Schema has processedBy as Int? - assuming it links to user ID for now.
                payoutDate: new Date()
            },
            include: { user: true }
        })

        // 2. Log Action
        await logAction('UPDATE', 'finance', `Processed payout of ₹${settlement.amount} for ${settlement.user.fullName}`, String(settlementId))

        // 3. Create In-App Notification
        await prisma.notification.create({
            data: {
                userId: settlement.userId,
                title: 'Payment Processed',
                message: `Your payout of ₹${settlement.amount.toLocaleString()} has been processed. transaction Ref: ${transactionId}`,
                type: 'payment',
                link: '/finance' // Or dashboard
            }
        })

        // 4. Send Email
        if (settlement.user.email) {
            await EmailService.sendPaymentConfirmation(
                settlement.user.email,
                settlement.user.fullName,
                settlement.amount,
                transactionId
            )
        }

        revalidatePath('/finance')
        return { success: true, message: 'Payout processed successfully' }
    } catch (error: any) {
        console.error('Process Payout Error:', error)
        return { success: false, error: error.message || 'Failed to process payout' }
    }
}
