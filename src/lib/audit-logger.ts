import prisma from './prisma'
import { getSession } from './session'
import { headers } from 'next/headers'

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'PERMISSION_CHANGE' | 'EXPORT' | 'EXPORT_REPORT'

/**
 * Shallow diffing utility to extract changed fields.
 */
function calculateDiff(oldObj: any, newObj: any) {
    if (!oldObj) return { _after: newObj }
    const diff: Record<string, { before: any; after: any }> = {}

    // Combine keys from both objects
    const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)])

    for (const key of allKeys) {
        // Skip common fields that clutter logs
        if (['updatedAt', 'createdAt', 'password'].includes(key)) continue

        if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
            diff[key] = {
                before: oldObj[key] ?? null,
                after: newObj[key] ?? null
            }
        }
    }
    return Object.keys(diff).length > 0 ? diff : null
}

export async function logAction(
    action: AuditAction,
    module: string,
    description: string,
    targetId?: string,
    metadata?: any,
    states?: { previous?: any; next?: any }
) {
    try {
        const session = await getSession()
        const headersList = await headers()
        const ip = headersList.get('x-forwarded-for')?.split(',')[0] || headersList.get('x-real-ip') || 'unknown'
        const userAgent = headersList.get('user-agent') || 'unknown'

        // Calculate differential if states are provided
        let finalMetadata = metadata || {}
        if (states?.next) {
            const diff = calculateDiff(states.previous, states.next)
            if (diff) {
                finalMetadata = { ...finalMetadata, _diff: diff }
            }
        }

        await prisma.activityLog.create({
            data: {
                adminId: session?.userType === 'admin' ? Number(session.userId) : null,
                userId: session?.userType === 'user' ? Number(session.userId) : null,
                action,
                module,
                targetId: targetId || null,
                description,
                metadata: (Object.keys(finalMetadata).length > 0 ? finalMetadata : null) as any,
                ipAddress: ip,
                userAgent,
            }
        })
    } catch (error) {
        console.error('Audit logging failed:', error)
    }
}
