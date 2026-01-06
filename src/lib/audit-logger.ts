import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { getCurrentUser } from '@/lib/auth-service'

export async function logAction(
    action: string,
    module: string,
    description: string,
    targetId?: string | null,
    actorId?: string | number | null | undefined, // support legacy calls passing null
    metadata?: any
) {
    try {
        const headersList = await headers()
        const ip = headersList.get('x-forwarded-for') || 'unknown'
        const userAgent = headersList.get('user-agent') || 'unknown'

        let adminId: number | undefined = undefined
        let userId: number | undefined = undefined

        // Auto-detect actor if not provided or valid
        const currentUser = await getCurrentUser()

        if (currentUser) {
            // Check for admin properties
            if ('adminId' in currentUser) {
                adminId = (currentUser as any).adminId
            } else if ('userId' in currentUser) {
                userId = (currentUser as any).userId
            }
        }

        await (prisma.activityLog as any).create({
            data: {
                action,
                module,
                description,
                targetId: targetId || undefined,
                adminId,
                userId,
                metadata: metadata || undefined,
                ipAddress: ip,
                userAgent: userAgent
            }
        })
    } catch (error) {
        console.error('Failed to log activity:', error)
    }
}

// Alias for future use if we prefer this naming
export const logActivity = async (params: {
    action: string
    module: string
    description: string
    metadata?: any
    targetId?: string
}) => {
    return logAction(
        params.action,
        params.module,
        params.description,
        params.targetId,
        null,
        params.metadata
    )
}
