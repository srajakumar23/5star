'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { logAction } from '@/lib/audit-logger'

export async function getCampaigns() {
    try {
        // Cast prisma to any to avoid build errors until client is regenerated
        const campaigns = await (prisma as any).campaign.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                logs: {
                    orderBy: { runAt: 'desc' },
                    take: 1
                }
            }
        })
        return { success: true, campaigns }
    } catch (error) {
        console.error('getCampaigns error:', error)
        return { success: false, error: 'Failed to fetch campaigns' }
    }
}

export async function createCampaign(data: {
    name: string,
    subject: string,
    templateBody: string,
    type?: string,
    targetAudience?: any
}) {
    try {
        const campaign = await (prisma as any).campaign.create({
            data: {
                name: data.name,
                subject: data.subject,
                templateBody: data.templateBody,
                type: data.type || 'EMAIL',
                targetAudience: data.targetAudience ?? {},
                status: 'DRAFT'
            }
        })

        await logAction('Create Campaign', 'Marketing', `Created campaign: ${data.name}`, undefined)
        revalidatePath('/superadmin')
        return { success: true, campaign }
    } catch (error) {
        console.error('createCampaign error:', error)
        return { success: false, error: 'Failed to create campaign' }
    }
}

export async function updateCampaign(id: number, data: Partial<{
    name: string,
    subject: string,
    templateBody: string,
    status: string,
    targetAudience: any
}>) {
    try {
        const campaign = await (prisma as any).campaign.update({
            where: { id },
            data
        })

        await logAction('Update Campaign', 'Marketing', `Updated campaign: ${id}`, undefined)
        revalidatePath('/superadmin')
        return { success: true, campaign }
    } catch (error) {
        console.error('updateCampaign error:', error)
        return { success: false, error: 'Failed to update campaign' }
    }
}

export async function deleteCampaign(id: number) {
    try {
        await (prisma as any).campaign.delete({
            where: { id }
        })

        await logAction('Delete Campaign', 'Marketing', `Deleted campaign: ${id}`, undefined)
        revalidatePath('/superadmin')
        return { success: true }
    } catch (error) {
        console.error('deleteCampaign error:', error)
        return { success: false, error: 'Failed to delete campaign' }
    }
}

export async function runCampaign(id: number) {
    try {
        const campaign = await (prisma as any).campaign.findUnique({ where: { id } })
        if (!campaign) return { success: false, error: 'Campaign not found' }

        // MOCK SENDING LOGIC FOR NOW (or move logic from engagement-actions.ts)
        // In a real scenario, we would query users based on targetAudience and send emails.
        const simulatedCount = Math.floor(Math.random() * 50) + 10

        await (prisma as any).campaignLog.create({
            data: {
                campaignId: id,
                status: 'SUCCESS',
                recipientCount: simulatedCount,
                sentCount: simulatedCount,
                failedCount: 0
            }
        })

        await (prisma as any).campaign.update({
            where: { id },
            data: { lastRunAt: new Date() }
        })

        await logAction('Run Campaign', 'Marketing', `Executed campaign: ${campaign.name}`, undefined)
        revalidatePath('/superadmin')
        return { success: true, sent: simulatedCount }
    } catch (error) {
        console.error('runCampaign error:', error)
        return { success: false, error: 'Failed to run campaign' }
    }
}
