'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-service'

export async function getAuditLogs(filters?: {
    module?: string,
    action?: string,
    search?: string
    startDate?: string
    endDate?: string
}) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser || currentUser.role !== 'Super Admin') {
            return { success: false, error: 'Unauthorized' }
        }

        const where: any = {}

        if (filters?.module && filters.module !== 'All') {
            where.module = filters.module
        }

        if (filters?.search) {
            where.OR = [
                { description: { contains: filters.search, mode: 'insensitive' } },
                { action: { contains: filters.search, mode: 'insensitive' } },
                // Add Admin Name search if needed by joining, but simple text search on description is often enough if we include names there
            ]
        }

        if (filters?.startDate) {
            where.createdAt = { ...where.createdAt, gte: new Date(filters.startDate) }
        }

        if (filters?.endDate) {
            where.createdAt = { ...where.createdAt, lte: new Date(filters.endDate) }
        }

        const logs = await prisma.activityLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 100
        })

        // Manual relation fetching since relations aren't defined in schema
        const adminIds = [...new Set(logs.map(l => l.adminId).filter(Boolean))] as number[]
        const userIds = [...new Set(logs.map(l => l.userId).filter(Boolean))] as number[]

        const [admins, users] = await Promise.all([
            adminIds.length ? prisma.admin.findMany({
                where: { adminId: { in: adminIds } },
                select: { adminId: true, adminName: true, role: true }
            }) : [],
            userIds.length ? prisma.user.findMany({
                where: { userId: { in: userIds } },
                select: { userId: true, fullName: true, role: true }
            }) : []
        ])

        const adminMap = new Map(admins.map(a => [a.adminId, a]))
        const userMap = new Map(users.map(u => [u.userId, u]))

        const fullLogs = logs.map(log => ({
            ...log,
            admin: log.adminId ? adminMap.get(log.adminId) : null,
            user: log.userId ? userMap.get(log.userId) : null
        }))

        return { success: true, logs: fullLogs }

    } catch (error: any) {
        console.error('Error fetching audit logs:', error)
        return { success: false, error: 'Failed to fetch logs' }
    }
}

export async function getAuditStats() {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser || currentUser.role !== 'Super Admin') {
            return { success: false, error: 'Unauthorized' }
        }

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

        // 1. Total Daily Volume
        const dailyCount = await prisma.activityLog.count({
            where: { createdAt: { gte: twentyFourHoursAgo } }
        })

        // 2. Security Alerts (Critical Actions)
        const securityAlerts = await prisma.activityLog.count({
            where: {
                OR: [
                    { action: { contains: 'DELETE' } },
                    { action: { contains: 'BAN' } },
                    { action: { contains: 'SECURITY' } },
                    { action: { contains: 'PERMISSION' } }
                ],
                createdAt: { gte: twentyFourHoursAgo }
            }
        })

        // 3. System Health (Module Distribution)
        const moduleCounts = await prisma.activityLog.groupBy({
            by: ['module'],
            _count: { _all: true },
            where: { createdAt: { gte: twentyFourHoursAgo } },
            orderBy: { _count: { module: 'desc' } },
            take: 5
        })

        // 4. Most Active Actor
        const topActor = await prisma.activityLog.groupBy({
            by: ['adminId', 'userId'],
            _count: { _all: true },
            where: { createdAt: { gte: twentyFourHoursAgo } },
            orderBy: { _count: { id: 'desc' } },
            take: 1
        })

        let topActorName = 'System'
        if (topActor[0]?.adminId) {
            const admin = await prisma.admin.findUnique({ where: { adminId: topActor[0].adminId }, select: { adminName: true } })
            topActorName = admin?.adminName || 'Admin'
        } else if (topActor[0]?.userId) {
            const user = await prisma.user.findUnique({ where: { userId: topActor[0].userId }, select: { fullName: true } })
            topActorName = user?.fullName || 'User'
        }

        return {
            success: true,
            stats: {
                dailyVolume: dailyCount,
                securityAlerts,
                moduleHealth: moduleCounts.map(m => ({ name: m.module, count: m._count._all })),
                topActor: {
                    name: topActorName,
                    count: topActor[0]?._count._all || 0
                }
            }
        }
    } catch (error) {
        console.error('Error fetching audit stats:', error)
        return { success: false, error: 'Failed to fetch audit stats' }
    }
}
