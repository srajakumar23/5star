'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-service'
import { logAction } from '@/lib/audit-logger'

export async function bulkAdminAction(adminIds: number[], action: 'activate' | 'suspend' | 'delete') {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser || currentUser.role !== 'Super Admin') {
            return { success: false, error: 'Unauthorized' }
        }

        if (action === 'delete') {
            // Safety check: Prevent deletion if it would remove all Super Admins
            const superAdminCount = await prisma.admin.count({
                where: { role: 'Super Admin' }
            })

            const deletingSuperAdmins = await prisma.admin.count({
                where: {
                    adminId: { in: adminIds },
                    role: 'Super Admin'
                }
            })

            if (superAdminCount - deletingSuperAdmins < 1) {
                return { success: false, error: 'Cannot delete all Super Admins. At least one must remain.' }
            }

            const res = await prisma.admin.deleteMany({
                where: { adminId: { in: adminIds } }
            })

            await logAction('DELETE', 'admin', `Bulk deleted ${res.count} administrators`, null, null, { adminIds })
            revalidatePath('/superadmin')
            return { success: true, count: res.count }
        }

        const statusMap: Record<string, 'Active' | 'Inactive'> = {
            'activate': 'Active',
            'suspend': 'Inactive'
        }

        const newStatus = statusMap[action]
        if (!newStatus) return { success: false, error: 'Invalid action' }

        const res = await prisma.admin.updateMany({
            where: { adminId: { in: adminIds } },
            data: { status: newStatus }
        })

        await logAction('UPDATE', 'admin', `Bulk ${action}d ${res.count} administrators`, null, null, { adminIds })
        revalidatePath('/superadmin')
        return { success: true, count: res.count }

    } catch (error) {
        console.error('Bulk admin action error:', error)
        return { success: false, error: 'Failed to perform bulk action' }
    }
}
