'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-service'
import { LeadStatus } from '@prisma/client'

// --- Ambassador Dashboard Actions ---

export async function getAmbassadorStats() {
    const user = await getCurrentUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        const [
            totalReferrals,
            pending,
            confirmed
        ] = await Promise.all([
            prisma.referralLead.count({ where: { userId: user.userId } }),
            prisma.referralLead.count({
                where: {
                    userId: user.userId,
                    leadStatus: { in: [LeadStatus.New, LeadStatus.Follow_up, LeadStatus.Interested] }
                }
            }),
            prisma.referralLead.count({
                where: {
                    userId: user.userId,
                    leadStatus: LeadStatus.Confirmed
                }
            })
        ])

        return {
            success: true,
            stats: {
                totalReferrals,
                pending,
                confirmed,
                conversionRate: totalReferrals > 0 ? ((confirmed / totalReferrals) * 100).toFixed(1) : 0
            }
        }
    } catch (error) {
        console.error('getAmbassadorStats Error:', error)
        return { error: 'Failed to fetch stats' }
    }
}

export async function getAmbassadorReferrals() {
    const user = await getCurrentUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        const referrals = await prisma.referralLead.findMany({
            where: { userId: user.userId },
            orderBy: { createdAt: 'desc' },
            include: {
                student: {
                    select: {
                        fullName: true,
                        grade: true,
                        campus: { select: { campusName: true } }
                    }
                }
            }
        })

        // Transform/Serialize if necessary for Client Components
        const cleanReferrals = referrals.map(r => ({
            ...r,
            // Basic serializable props
            submittedAt: r.createdAt.toISOString(),
            status: r.leadStatus, // Enum is fine
            studentName: r.student?.fullName || r.studentName,
            campusName: r.student?.campus?.campusName || r.campus
        }))

        return { success: true, referrals: cleanReferrals }
    } catch (error) {
        console.error('getAmbassadorReferrals Error:', error)
        return { error: 'Failed to fetch referrals' }
    }
}

// Helper to calculate benefits (Mock logic based on errors seen)
// The user mentioned parameters 'r' and 'ref' having any type issues.
// This function likely iterates over referrals to calculate metrics.
export function calculateAmbassadorBenefits(referrals: any[]) {
    // Explicitly typing 'r' to avoid implicit any error
    return referrals.reduce((total: number, r: any) => {
        const benefit = r.benefitAmount || 0
        return total + benefit
    }, 0)
}
