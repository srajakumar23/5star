'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-service'
import { revalidatePath } from 'next/cache'

export async function submitReferral(formData: any) {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { parentName, parentMobile, campus, gradeInterested } = formData

    if (!parentName || !parentMobile) {
        return { success: false, error: 'Name and Mobile are required' }
    }

    try {
        await prisma.referralLead.create({
            data: {
                userId: user.userId,
                parentName,
                parentMobile,
                campus,
                gradeInterested
            }
        })

        revalidatePath('/dashboard')
        revalidatePath('/referrals')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { success: false, error: 'Failed to submit referral' }
    }
}

export async function getMyReferrals() {
    const user = await getCurrentUser()
    if (!user) return []

    return await prisma.referralLead.findMany({
        where: { userId: user.userId },
        orderBy: { createdAt: 'desc' }
    })
}
