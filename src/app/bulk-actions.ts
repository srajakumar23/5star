'use server'

import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth-service"
import { logAction } from "@/lib/audit-logger"
import { revalidatePath } from 'next/cache'

export async function bulkUserAction(userIds: number[], action: 'activate' | 'suspend' | 'delete' | 'deactivate') {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser || currentUser.role !== 'Super Admin') {
            return { success: false, error: 'Unauthorized' }
        }

        if (action === 'delete') {
            // Delete leads first
            await prisma.referralLead.deleteMany({
                where: { userId: { in: userIds } }
            })

            const res = await prisma.user.deleteMany({
                where: { userId: { in: userIds } }
            })
            await logAction('DELETE', 'user', `Bulk deleted ${res.count} users`, null, null, { userIds })
            revalidatePath('/superadmin')
            return { success: true, count: res.count }
        }

        const statusMap: Record<string, 'Active' | 'Suspended' | 'Inactive' | 'Pending'> = {
            'activate': 'Active',
            'suspend': 'Suspended',
            'deactivate': 'Inactive'
        }

        const newStatus = statusMap[action]
        if (!newStatus) return { success: false, error: 'Invalid action' }

        const res = await prisma.user.updateMany({
            where: { userId: { in: userIds } },
            data: { status: newStatus } // We use string literal for now as per schema, or Enum if applicable
        })

        await logAction('UPDATE', 'user', `Bulk ${action}d ${res.count} users`, null, null, { userIds })
        revalidatePath('/superadmin')
        return { success: true, count: res.count }

    } catch (error) {
        console.error('Bulk user action error:', error)
        return { success: false, error: 'Failed to perform bulk action' }
    }
}
