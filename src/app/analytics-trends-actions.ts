'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-service'
import { subMonths, format, startOfMonth, endOfMonth } from 'date-fns'

export async function getAnalyticsTrends() {
    const user = await getCurrentUser()
    if (!user || user.role !== 'Super Admin') {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        // 1. Admission Trends (Last 6 Months)
        const months = 6
        const trends = []

        for (let i = months - 1; i >= 0; i--) {
            const date = subMonths(new Date(), i)
            const monthStart = startOfMonth(date)
            const monthEnd = endOfMonth(date)
            const monthLabel = format(date, 'MMM yyyy')

            // Group by Activity (Leads vs Admissions)
            const leads = await prisma.referralLead.count({
                where: {
                    createdAt: { gte: monthStart, lte: monthEnd }
                }
            })

            const admissions = await prisma.student.count({
                where: {
                    createdAt: { gte: monthStart, lte: monthEnd }
                }
            })

            trends.push({
                date: monthLabel,
                leads,
                admissions
            })
        }

        // 2. Referrer Comparison (Source Distribution)
        // Count how many LEADS came from each User Role
        // This is complex because ReferralLead -> User -> Role
        // We can use groupBy on User via join but Prisma doesn't support deep groupBy nicely, 
        // simpler to fetch distributions or raw query.
        // Let's use raw query for efficiency or simpler aggregation.

        const referrerDistribution = await prisma.$queryRaw`
            SELECT u.role as name, COUNT(l."leadId") as value
            FROM "ReferralLead" l
            JOIN "User" u ON l."userId" = u."userId"
            GROUP BY u.role
        `

        return {
            success: true,
            trends,
            referrerDistribution: (referrerDistribution as any[]).map(r => ({
                name: r.name,
                value: Number(r.value) // Count returns BigInt usually
            }))
        }

    } catch (error) {
        console.error('Error fetching analytics trends:', error)
        return { success: false, error: 'Failed to fetch trends' }
    }
}
