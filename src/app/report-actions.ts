'use server'

import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

import { getCurrentUser } from '@/lib/auth-service'

// ===================== REPORT #1: REFERRAL PERFORMANCE =====================
export async function generateReferralPerformanceReport() {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        // Get all users with their referral counts
        const users = await prisma.user.findMany({
            where: { isFiveStarMember: true },
            include: {
                referrals: {
                    select: {
                        leadStatus: true
                    }
                }
            },
            orderBy: { confirmedReferralCount: 'desc' }
        })

        // Format CSV
        let csv = 'Ambassador Name,Role,Campus,Total Referrals,Confirmed,Pending,Conversion Rate,Benefit Tier,Year Fee Benefit,Long Term Benefit,Status\n'

        users.forEach(user => {
            const totalReferrals = user.referrals.length
            const confirmed = user.referrals.filter(r => r.leadStatus === 'Confirmed').length
            const pending = user.referrals.filter(r => r.leadStatus !== 'Confirmed').length
            const conversionRate = totalReferrals > 0 ? ((confirmed / totalReferrals) * 100).toFixed(1) : '0'
            const benefitTier = confirmed >= 5 ? '5 Stars' : confirmed >= 4 ? '4 Stars' : confirmed >= 3 ? '3 Stars' : confirmed >= 2 ? '2 Stars' : confirmed >= 1 ? '1 Star' : 'None'

            csv += `"${user.fullName}",${user.role},"${user.assignedCampus || 'Not Assigned'}",${totalReferrals},${confirmed},${pending},${conversionRate}%,${benefitTier},${user.yearFeeBenefitPercent}%,${user.longTermBenefitPercent}%,${user.status}\n`
        })

        return { success: true, csv, filename: `referral-performance-${new Date().toISOString().split('T')[0]}.csv` }
    } catch (error) {
        console.error('Referral Performance Report Error:', error)
        return { success: false, error: 'Failed to generate report' }
    }
}

// ===================== REPORT #2: PENDING LEADS =====================
export async function generatePendingLeadsReport() {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        const pendingLeads = await prisma.referralLead.findMany({
            where: {
                leadStatus: { in: ['New', 'Follow-up'] }
            },
            include: {
                user: {
                    select: { fullName: true, mobileNumber: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        let csv = 'Lead Name,Parent Mobile,Interested Campus,Grade,Status,Referred By,Ambassador Mobile,Days Pending,Created Date\n'

        pendingLeads.forEach(lead => {
            const daysPending = Math.floor((new Date().getTime() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24))
            csv += `"${lead.parentName}",${lead.parentMobile},"${lead.campus || 'Not Specified'}","${lead.gradeInterested || 'Not Specified'}",${lead.leadStatus},"${lead.user.fullName}",${lead.user.mobileNumber},${daysPending},${new Date(lead.createdAt).toLocaleDateString()}\n`
        })

        return { success: true, csv, filename: `pending-leads-${new Date().toISOString().split('T')[0]}.csv` }
    } catch (error) {
        console.error('Pending Leads Report Error:', error)
        return { success: false, error: 'Failed to generate report' }
    }
}

// ===================== REPORT #3: MONTHLY TRENDS =====================
export async function generateMonthlyTrendsReport() {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        // Get data for last 12 months
        const monthsData: any[] = []
        for (let i = 11; i >= 0; i--) {
            const date = new Date()
            date.setMonth(date.getMonth() - i)
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)

            const newAmbassadors = await prisma.user.count({
                where: {
                    isFiveStarMember: true,
                    createdAt: { gte: monthStart, lte: monthEnd }
                }
            })

            const newLeads = await prisma.referralLead.count({
                where: {
                    createdAt: { gte: monthStart, lte: monthEnd }
                }
            })

            const confirmed = await prisma.referralLead.count({
                where: {
                    leadStatus: 'Confirmed',
                    confirmedDate: { gte: monthStart, lte: monthEnd }
                }
            })

            const conversionRate = newLeads > 0 ? ((confirmed / newLeads) * 100).toFixed(1) : '0'

            monthsData.push({
                month: monthStart.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
                newAmbassadors,
                newLeads,
                confirmed,
                conversionRate
            })
        }

        let csv = 'Month,New Ambassadors,New Leads,Confirmed Admissions,Conversion Rate\n'
        monthsData.forEach(m => {
            csv += `${m.month},${m.newAmbassadors},${m.newLeads},${m.confirmed},${m.conversionRate}%\n`
        })

        return { success: true, csv, filename: `monthly-trends-${new Date().toISOString().split('T')[0]}.csv` }
    } catch (error) {
        console.error('Monthly Trends Report Error:', error)
        return { success: false, error: 'Failed to generate report' }
    }
}

// ===================== REPORT #4: INACTIVE USERS =====================
export async function generateInactiveUsersReport() {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        const inactiveUsers = await prisma.user.findMany({
            where: {
                isFiveStarMember: true,
                status: 'Inactive'
            },
            include: {
                referrals: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        let csv = 'Ambassador Name,Role,Campus,Mobile,Total Referrals,Last Referral Date,Registered Date,Status\n'

        inactiveUsers.forEach(user => {
            const lastReferralDate = user.referrals[0] ? new Date(user.referrals[0].createdAt).toLocaleDateString() : 'Never'
            csv += `"${user.fullName}",${user.role},"${user.assignedCampus || 'Not Assigned'}",${user.mobileNumber},${user.confirmedReferralCount},${lastReferralDate},${new Date(user.createdAt).toLocaleDateString()},${user.status}\n`
        })

        return { success: true, csv, filename: `inactive-users-${new Date().toISOString().split('T')[0]}.csv` }
    } catch (error) {
        console.error('Inactive Users Report Error:', error)
        return { success: false, error: 'Failed to generate report' }
    }
}

// ===================== REPORT #5: TOP PERFORMERS LEADERBOARD =====================
export async function generateTopPerformersReport() {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        const topPerformers = await prisma.user.findMany({
            where: { isFiveStarMember: true },
            include: {
                referrals: {
                    where: { leadStatus: 'Confirmed' }
                }
            },
            orderBy: { confirmedReferralCount: 'desc' },
            take: 20
        })

        let csv = 'Rank,Ambassador Name,Role,Campus,Confirmed Referrals,Benefit Tier,Year Fee Benefit,Long Term Benefit\n'

        topPerformers.forEach((user, index) => {
            const benefitTier = user.confirmedReferralCount >= 5 ? '5 Stars' : user.confirmedReferralCount >= 4 ? '4 Stars' : user.confirmedReferralCount >= 3 ? '3 Stars' : user.confirmedReferralCount >= 2 ? '2 Stars' : '1 Star'
            csv += `${index + 1},"${user.fullName}",${user.role},"${user.assignedCampus || 'Not Assigned'}",${user.confirmedReferralCount},${benefitTier},${user.yearFeeBenefitPercent}%,${user.longTermBenefitPercent}%\n`
        })

        return { success: true, csv, filename: `top-performers-${new Date().toISOString().split('T')[0]}.csv` }
    } catch (error) {
        console.error('Top Performers Report Error:', error)
        return { success: false, error: 'Failed to generate report' }
    }
}

// ===================== REPORT #6: CAMPUS DISTRIBUTION =====================
export async function generateCampusDistributionReport() {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        const campuses = ['ASM-VILLIANUR(9-12)', 'ASM-VILLIANUR(MONT-8)', 'ASM-VILLUPURAM', 'ASM-ALAPAKKAM', 'ADYAR', 'AKLAVYA-RP', 'KKNAGAR', 'VALASARAVAKKAM']

        let csv = 'Campus,Total Ambassadors,Parents,Staff,Total Leads,Confirmed,Conversion Rate,Active Ambassadors\n'

        for (const campus of campuses) {
            const totalAmbassadors = await prisma.user.count({
                where: { isFiveStarMember: true, assignedCampus: campus }
            })

            const parents = await prisma.user.count({
                where: { isFiveStarMember: true, assignedCampus: campus, role: 'Parent' }
            })

            const staff = await prisma.user.count({
                where: { isFiveStarMember: true, assignedCampus: campus, role: 'Staff' }
            })

            const totalLeads = await prisma.referralLead.count({
                where: { campus }
            })

            const confirmed = await prisma.referralLead.count({
                where: { campus, leadStatus: 'Confirmed' }
            })

            const activeAmbassadors = await prisma.user.count({
                where: { isFiveStarMember: true, assignedCampus: campus, status: 'Active' }
            })

            const conversionRate = totalLeads > 0 ? ((confirmed / totalLeads) * 100).toFixed(1) : '0'

            csv += `"${campus}",${totalAmbassadors},${parents},${staff},${totalLeads},${confirmed},${conversionRate}%,${activeAmbassadors}\n`
        }

        return { success: true, csv, filename: `campus-distribution-${new Date().toISOString().split('T')[0]}.csv` }
    } catch (error) {
        console.error('Campus Distribution Report Error:', error)
        return { success: false, error: 'Failed to generate report' }
    }
}

// ===================== REPORT #7: BENEFIT TIER ANALYSIS =====================
export async function generateBenefitTierReport() {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        const tiers = [
            { name: '5 Stars', min: 5, max: Infinity },
            { name: '4 Stars', min: 4, max: 4 },
            { name: '3 Stars', min: 3, max: 3 },
            { name: '2 Stars', min: 2, max: 2 },
            { name: '1 Star', min: 1, max: 1 },
            { name: 'No Tier', min: 0, max: 0 }
        ]

        let csv = 'Benefit Tier,User Count,Year Fee Benefit Range,Long Term Benefit Range,Total Users Percentage\n'

        const totalUsers = await prisma.user.count({ where: { isFiveStarMember: true } })

        for (const tier of tiers) {
            const users = await prisma.user.findMany({
                where: {
                    isFiveStarMember: true,
                    confirmedReferralCount: tier.max === Infinity ? { gte: tier.min } : { gte: tier.min, lte: tier.max }
                },
                select: { yearFeeBenefitPercent: true, longTermBenefitPercent: true }
            })

            const count = users.length
            const percentage = totalUsers > 0 ? ((count / totalUsers) * 100).toFixed(1) : '0'
            const yearFeeRange = count > 0 ? `${Math.min(...users.map((u: any) => u.yearFeeBenefitPercent))}-${Math.max(...users.map((u: any) => u.yearFeeBenefitPercent))}%` : 'N/A'
            const longTermRange = count > 0 ? `${Math.min(...users.map((u: any) => u.longTermBenefitPercent))}-${Math.max(...users.map((u: any) => u.longTermBenefitPercent))}%` : 'N/A'

            csv += `${tier.name},${count},${yearFeeRange},${longTermRange},${percentage}%\n`
        }

        return { success: true, csv, filename: `benefit-tier-analysis-${new Date().toISOString().split('T')[0]}.csv` }
    } catch (error) {
        console.error('Benefit Tier Report Error:', error)
        return { success: false, error: 'Failed to generate report' }
    }
}

// ===================== REPORT #8: NEW REGISTRATIONS =====================
export async function generateNewRegistrationsReport() {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const newUsers = await prisma.user.findMany({
            where: {
                isFiveStarMember: true,
                createdAt: { gte: thirtyDaysAgo }
            },
            orderBy: { createdAt: 'desc' }
        })

        let csv = 'Registration Date,Ambassador Name,Role,Campus,Mobile,Current Referrals,Status\n'

        newUsers.forEach((user: any) => {
            csv += `${new Date(user.createdAt).toLocaleDateString()},"${user.fullName}",${user.role},"${user.assignedCampus || 'Not Assigned'}",${user.mobileNumber},${user.confirmedReferralCount},${user.status}\n`
        })

        return { success: true, csv, filename: `new-registrations-${new Date().toISOString().split('T')[0]}.csv` }
    } catch (error) {
        console.error('New Registrations Report Error:', error)
        return { success: false, error: 'Failed to generate report' }
    }
}

// ===================== REPORT #9: STAFF VS PARENT COMPARISON =====================
export async function generateStaffVsParentReport() {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        const roles = ['Parent', 'Staff']
        let csv = 'Role,Total Ambassadors,Active,Inactive,Total Referrals,Avg Referrals/User,Total Confirmed,Avg Conversion Rate\n'

        for (const role of roles) {
            const totalAmbassadors = await prisma.user.count({
                where: { isFiveStarMember: true, role }
            })

            const active = await prisma.user.count({
                where: { isFiveStarMember: true, role, status: 'Active' }
            })

            const inactive = await prisma.user.count({
                where: { isFiveStarMember: true, role, status: 'Inactive' }
            })

            const users = await prisma.user.findMany({
                where: { isFiveStarMember: true, role },
                include: { referrals: true }
            })

            const totalReferrals = users.reduce((sum, u) => sum + u.referrals.length, 0)
            const totalConfirmed = users.reduce((sum, u) => sum + u.confirmedReferralCount, 0)
            const avgReferrals = totalAmbassadors > 0 ? (totalReferrals / totalAmbassadors).toFixed(1) : '0'
            const avgConversion = totalReferrals > 0 ? ((totalConfirmed / totalReferrals) * 100).toFixed(1) : '0'

            csv += `${role},${totalAmbassadors},${active},${inactive},${totalReferrals},${avgReferrals},${totalConfirmed},${avgConversion}%\n`
        }

        return { success: true, csv, filename: `staff-vs-parent-${new Date().toISOString().split('T')[0]}.csv` }
    } catch (error) {
        console.error('Staff vs Parent Report Error:', error)
        return { success: false, error: 'Failed to generate report' }
    }
}

// ===================== REPORT #10: LEAD STATUS PIPELINE =====================
export async function generateLeadPipelineReport() {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        const statuses = ['New', 'Follow-up', 'Confirmed']
        let csv = 'Lead Status,Count,Percentage,Avg Days in Stage\n'

        const totalLeads = await prisma.referralLead.count()

        for (const status of statuses) {
            const count = await prisma.referralLead.count({
                where: { leadStatus: status }
            })

            const leads = await prisma.referralLead.findMany({
                where: { leadStatus: status }
            })

            const percentage = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(1) : '0'

            const avgDays = leads.length > 0 ?
                (leads.reduce((sum, lead) => {
                    const endDate = status === 'Confirmed' && lead.confirmedDate ? new Date(lead.confirmedDate) : new Date()
                    const startDate = new Date(lead.createdAt)
                    return sum + Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                }, 0) / leads.length).toFixed(1) : '0'

            csv += `${status},${count},${percentage}%,${avgDays} days\n`
        }

        return { success: true, csv, filename: `lead-pipeline-${new Date().toISOString().split('T')[0]}.csv` }
    } catch (error) {
        console.error('Lead Pipeline Report Error:', error)
        return { success: false, error: 'Failed to generate report' }
    }
}
