'use server'

import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

import { getCurrentUser } from '@/lib/auth-service'

export async function getSecuritySettings() {
    try {
        const settings = await prisma.securitySettings.findFirst()
        if (!settings) {
            return {
                sessionTimeoutMinutes: 30,
                maxLoginAttempts: 5,
                passwordResetExpiryHours: 24,
                twoFactorAuthEnabled: false
            }
        }
        return settings
    } catch (error) {
        console.error('Error fetching security settings:', error)
        return {
            sessionTimeoutMinutes: 30,
            maxLoginAttempts: 5,
            passwordResetExpiryHours: 24,
            twoFactorAuthEnabled: false
        }
    }
}

export async function updateSecuritySettings(data: {
    sessionTimeoutMinutes?: number
    maxLoginAttempts?: number
    passwordResetExpiryHours?: number
    twoFactorAuthEnabled?: boolean
}) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== 'Super Admin') {
            return { success: false, error: 'Unauthorized' }
        }

        const settings = await prisma.securitySettings.findFirst()

        if (settings) {
            await prisma.securitySettings.update({
                where: { id: settings.id },
                data: { ...data, updatedBy: user.fullName }
            })
        } else {
            await prisma.securitySettings.create({
                data: {
                    sessionTimeoutMinutes: data.sessionTimeoutMinutes ?? 30,
                    maxLoginAttempts: data.maxLoginAttempts ?? 5,
                    passwordResetExpiryHours: data.passwordResetExpiryHours ?? 24,
                    twoFactorAuthEnabled: data.twoFactorAuthEnabled ?? false,
                    updatedBy: user.fullName
                }
            })
        }
        return { success: true }
    } catch (error) {
        console.error('Error updating security settings:', error)
        return { success: false, error: 'Failed to update settings' }
    }
}

export async function getRetentionSettings() {
    try {
        const settings = await prisma.dataRetentionSettings.findFirst()
        if (!settings) {
            return {
                keepInactiveDataMonths: 12,
                archiveLeadsAfterDays: 365,
                backupFrequencyDays: 7
            }
        }
        return settings
    } catch (error) {
        console.error('Error fetching retention settings:', error)
        return {
            keepInactiveDataMonths: 12,
            archiveLeadsAfterDays: 365,
            backupFrequencyDays: 7
        }
    }
}

export async function updateRetentionSettings(data: {
    keepInactiveDataMonths?: number
    archiveLeadsAfterDays?: number
    backupFrequencyDays?: number
}) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== 'Super Admin') {
            return { success: false, error: 'Unauthorized' }
        }

        const settings = await prisma.dataRetentionSettings.findFirst()

        if (settings) {
            await prisma.dataRetentionSettings.update({
                where: { id: settings.id },
                data: { ...data, updatedBy: user.fullName }
            })
        } else {
            await prisma.dataRetentionSettings.create({
                data: {
                    keepInactiveDataMonths: data.keepInactiveDataMonths ?? 12,
                    archiveLeadsAfterDays: data.archiveLeadsAfterDays ?? 365,
                    backupFrequencyDays: data.backupFrequencyDays ?? 7,
                    updatedBy: user.fullName
                }
            })
        }
        return { success: true }
    } catch (error) {
        console.error('Error updating retention settings:', error)
        return { success: false, error: 'Failed to update settings' }
    }
}
