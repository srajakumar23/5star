'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-service'

export async function getUserActivityHistory(targetUserId: number) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser || !currentUser.role.includes('Admin')) {
            return { success: false, error: 'Unauthorized' }
        }

        const logs = await prisma.activityLog.findMany({
            where: {
                OR: [
                    { userId: targetUserId }, // Actions performed BY the user
                    { description: { contains: `user ${targetUserId}` } }, // Actions performed ON the user (legacy text match)
                    { targetId: targetUserId.toString() } // Actions performed ON the user (structured)
                ]
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        })

        return { success: true, logs }
    } catch (error) {
        console.error('Error fetching user activity:', error)
        return { success: false, error: 'Failed to fetch activity' }
    }
}
