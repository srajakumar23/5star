'use server'

import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

import { getCurrentUser } from '@/lib/auth-service'

export async function getLeadSettings() {
    try {
        const settings = await prisma.leadManagementSettings.findFirst()
        if (!settings) {
            return {
                autoAssignLeads: true,
                leadStaleDays: 30,
                followupEscalationDays: 7,
                duplicateDetectionEnabled: true
            }
        }
        return settings
    } catch (error) {
        console.error('Error fetching lead settings:', error)
        return {
            autoAssignLeads: true,
            leadStaleDays: 30,
            followupEscalationDays: 7,
            duplicateDetectionEnabled: true
        }
    }
}

export async function updateLeadSettings(data: {
    autoAssignLeads?: boolean
    leadStaleDays?: number
    followupEscalationDays?: number
    duplicateDetectionEnabled?: boolean
}) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== 'Super Admin') {
            return { success: false, error: 'Unauthorized' }
        }

        const settings = await prisma.leadManagementSettings.findFirst()

        if (settings) {
            await prisma.leadManagementSettings.update({
                where: { id: settings.id },
                data: { ...data, updatedBy: user.fullName }
            })
        } else {
            await prisma.leadManagementSettings.create({
                data: {
                    autoAssignLeads: data.autoAssignLeads ?? true,
                    leadStaleDays: data.leadStaleDays ?? 30,
                    followupEscalationDays: data.followupEscalationDays ?? 7,
                    duplicateDetectionEnabled: data.duplicateDetectionEnabled ?? true,
                    updatedBy: user.fullName
                }
            })
        }
        return { success: true }
    } catch (error) {
        console.error('Error updating lead settings:', error)
        return { success: false, error: 'Failed to update settings' }
    }
}
