'use server'

import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

import { getCurrentUser } from '@/lib/auth-service'

export async function getBenefitSlabs() {
    try {
        const slabs = await prisma.benefitSlab.findMany({
            orderBy: { referralCount: 'asc' }
        })
        return { success: true, slabs }
    } catch (error) {
        console.error('Get benefit slabs error:', error)
        return { success: false, error: 'Failed to fetch benefit slabs' }
    }
}

export async function updateBenefitSlab(slabId: number, data: {
    tierName?: string
    referralCount?: number
    yearFeeBenefitPercent?: number
    longTermExtraPercent?: number
    baseLongTermPercent?: number
    description?: string
}) {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Only Super Admin can update benefit tiers' }
    }

    try {
        const slab = await prisma.benefitSlab.update({
            where: { slabId },
            data
        })
        return { success: true, slab }
    } catch (error) {
        console.error('Update benefit slab error:', error)
        return { success: false, error: 'Failed to update benefit tier' }
    }
}

export async function addBenefitSlab(data: {
    tierName: string
    referralCount: number
    yearFeeBenefitPercent: number
    longTermExtraPercent: number
    baseLongTermPercent: number
    description?: string
}) {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Only Super Admin can add benefit tiers' }
    }

    try {
        const slab = await prisma.benefitSlab.create({
            data
        })
        return { success: true, slab }
    } catch (error) {
        console.error('Add benefit slab error:', error)
        return { success: false, error: 'Failed to add benefit tier' }
    }
}

export async function deleteBenefitSlab(slabId: number) {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Only Super Admin can delete benefit tiers' }
    }

    try {
        await prisma.benefitSlab.delete({
            where: { slabId }
        })
        return { success: true }
    } catch (error) {
        console.error('Delete benefit slab error:', error)
        return { success: false, error: 'Failed to delete benefit tier' }
    }
}
