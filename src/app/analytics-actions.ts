'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-service'
import { startOfDay, endOfDay, subDays } from 'date-fns'

export interface ExplorationFilters {
    dateRange?: {
        from?: string
        to?: string
        preset?: '7d' | '30d' | '90d' | 'all'
    }
    campus?: string
    role?: string
}

/**
 * Optimized server action for the Interactive Data Explorer.
 * Returns a flat structure suitable for data tables and charts.
 */
export async function getExplorationData(reportId: string, filters: ExplorationFilters) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'Super Admin') return { success: false, error: 'Unauthorized' }

    try {
        // 1. Calculate Date Filters
        let startDate: Date | undefined
        let endDate: Date = endOfDay(new Date())

        if (filters.dateRange?.preset && filters.dateRange.preset !== 'all') {
            const days = filters.dateRange.preset === '7d' ? 7 : filters.dateRange.preset === '30d' ? 30 : 90
            startDate = startOfDay(subDays(new Date(), days))
        } else if (filters.dateRange?.from && filters.dateRange?.to) {
            startDate = startOfDay(new Date(filters.dateRange.from))
            endDate = endOfDay(new Date(filters.dateRange.to))
        }

        const dateFilter = startDate ? { gte: startDate, lte: endDate } : undefined

        // 2. Fetch Data based on Report ID
        if (reportId === 'users') {
            const users = await prisma.user.findMany({
                where: {
                    ...(dateFilter && { createdAt: dateFilter }),
                    ...(filters.campus && filters.campus !== 'All' && { assignedCampus: filters.campus }),
                    ...(filters.role && filters.role !== 'All' && { role: filters.role as any })
                },
                select: {
                    userId: true,
                    fullName: true,
                    mobileNumber: true,
                    role: true,
                    assignedCampus: true,
                    confirmedReferralCount: true,
                    status: true,
                    createdAt: true
                },
                orderBy: { createdAt: 'desc' }
            })

            return { success: true, data: users }
        }

        if (reportId === 'leads' || reportId === 'pipeline') {
            const leads = await prisma.referralLead.findMany({
                where: {
                    ...(dateFilter && { createdAt: dateFilter }),
                    ...(filters.campus && filters.campus !== 'All' && { campus: filters.campus })
                },
                include: {
                    user: {
                        select: { fullName: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })

            const flatLeads = leads.map(l => ({
                id: l.leadId,
                name: l.parentName,
                mobile: l.parentMobile,
                campus: l.campus,
                grade: l.gradeInterested,
                status: l.leadStatus,
                referredBy: l.user.fullName,
                createdAt: l.createdAt
            }))

            return { success: true, data: flatLeads }
        }

        return { success: false, error: 'Report type not implemented for explorer' }

    } catch (error) {
        console.error('Exploration Data Error:', error)
        return { success: false, error: 'Failed to fetch analytical data' }
    }
}
