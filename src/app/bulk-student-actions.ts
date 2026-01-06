'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-service'
import { logAction } from '@/lib/audit-logger'

export async function bulkStudentAction(
    studentIds: number[],
    action: 'activate' | 'suspend' | 'delete' | 'transfer',
    targetCampusId?: number
) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser || currentUser.role !== 'Super Admin') {
            return { success: false, error: 'Unauthorized' }
        }

        if (action === 'delete') {
            const res = await prisma.student.deleteMany({
                where: { studentId: { in: studentIds } }
            })

            await logAction('DELETE', 'student', `Bulk deleted ${res.count} students`, null, null, { studentIds })
            revalidatePath('/superadmin')
            return { success: true, count: res.count }
        }

        if (action === 'transfer') {
            if (!targetCampusId) {
                return { success: false, error: 'Target campus is required for transfer' }
            }

            const res = await prisma.student.updateMany({
                where: { studentId: { in: studentIds } },
                data: { campusId: targetCampusId }
            })

            await logAction('UPDATE', 'student', `Bulk transferred ${res.count} students to campus ${targetCampusId}`, null, null, { studentIds, targetCampusId })
            revalidatePath('/superadmin')
            return { success: true, count: res.count }
        }

        const statusMap: Record<string, 'Active' | 'Inactive'> = {
            'activate': 'Active',
            'suspend': 'Inactive'
        }

        const newStatus = statusMap[action]
        if (!newStatus) return { success: false, error: 'Invalid action' }

        const res = await prisma.student.updateMany({
            where: { studentId: { in: studentIds } },
            data: { status: newStatus }
        })

        await logAction('UPDATE', 'student', `Bulk ${action}d ${res.count} students`, null, null, { studentIds })
        revalidatePath('/superadmin')
        return { success: true, count: res.count }

    } catch (error) {
        console.error('Bulk student action error:', error)
        return { success: false, error: 'Failed to perform bulk action' }
    }
}
