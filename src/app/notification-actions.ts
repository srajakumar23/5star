'use server'

import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

import { getCurrentUser } from '@/lib/auth-service'

export async function getNotificationSettings() {
    try {
        const settings = await prisma.notificationSettings.findFirst()
        if (!settings) {
            return {
                emailNotifications: true,
                smsNotifications: false,
                whatsappNotifications: true,
                leadFollowupReminders: true,
                reminderFrequencyDays: 3,
                notifySuperAdminOnNewAdmins: true,
                notifyCampusHeadOnNewLeads: true
            }
        }
        return settings
    } catch (error) {
        console.error('Error fetching notification settings:', error)
        return {
            emailNotifications: true,
            smsNotifications: false,
            whatsappNotifications: true,
            leadFollowupReminders: true,
            reminderFrequencyDays: 3,
            notifySuperAdminOnNewAdmins: true,
            notifyCampusHeadOnNewLeads: true
        }
    }
}

export async function updateNotificationSettings(data: {
    emailNotifications?: boolean
    smsNotifications?: boolean
    whatsappNotifications?: boolean
    leadFollowupReminders?: boolean
    reminderFrequencyDays?: number
    notifySuperAdminOnNewAdmins?: boolean
    notifyCampusHeadOnNewLeads?: boolean
}) {
    try {
        const user = await getCurrentUser()

        if (!user || user.role !== 'Super Admin') {
            return { success: false, error: 'Unauthorized. Only Super Admin can change settings.' }
        }

        const settings = await prisma.notificationSettings.findFirst()

        if (settings) {
            await prisma.notificationSettings.update({
                where: { id: settings.id },
                data: {
                    ...data,
                    updatedBy: user.fullName
                }
            })
        } else {
            await prisma.notificationSettings.create({
                data: {
                    emailNotifications: data.emailNotifications ?? true,
                    smsNotifications: data.smsNotifications ?? false,
                    whatsappNotifications: data.whatsappNotifications ?? true,
                    leadFollowupReminders: data.leadFollowupReminders ?? true,
                    reminderFrequencyDays: data.reminderFrequencyDays ?? 3,
                    notifySuperAdminOnNewAdmins: data.notifySuperAdminOnNewAdmins ?? true,
                    notifyCampusHeadOnNewLeads: data.notifyCampusHeadOnNewLeads ?? true,
                    updatedBy: user.fullName
                }
            })
        }

        return { success: true }
    } catch (error) {
        console.error('Error updating notification settings:', error)
        return { success: false, error: 'Failed to update notification settings' }
    }
}
