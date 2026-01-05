'use server'

import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-service'
import { revalidatePath } from 'next/cache'
import { logAction } from '@/lib/audit-logger'
import { z } from 'zod'

// Validation Schema for Settings
const SettingsUpdateSchema = z.object({
    maintenanceMode: z.boolean().optional(),
    allowNewRegistrations: z.boolean().optional(),
    staffReferralText: z.string().max(500).optional(),
    parentReferralText: z.string().max(500).optional(),
    staffWelcomeMessage: z.string().max(100).optional(),
    parentWelcomeMessage: z.string().max(100).optional(),
    alumniReferralText: z.string().max(500).optional(),
    alumniWelcomeMessage: z.string().max(100).optional(),
})

/**
 * Get current registration status (public - anyone can read)
 * EXPERT: Fail-closed (false) implementation.
 */
export async function getRegistrationStatus(): Promise<boolean> {
    try {
        const settings = await prisma.systemSettings.findFirst()
        // Fail-closed: default to FALSE if not found or on error
        return settings?.allowNewRegistrations ?? false
    } catch (error) {
        console.error('Error fetching registration status:', error)
        return false // Fail-closed
    }
}

export async function getSystemSettings() {
    try {
        // Fetch global flags
        const settings = await prisma.systemSettings.findFirst()

        // Fetch current academic year from the consolidated source of truth
        // @ts-ignore - Stale Prisma synchronization issue
        const currentYearRecord = await prisma.academicYear.findFirst({
            where: { isCurrent: true }
        })

        const defaultSettings = {
            allowNewRegistrations: false, // Fail-closed default
            currentAcademicYear: currentYearRecord?.year || '2025-2026',
            defaultStudentFee: 60000,
            maintenanceMode: false
        }

        if (!settings) return defaultSettings

        return {
            ...settings,
            currentAcademicYear: currentYearRecord?.year || '2025-2026'
        }
    } catch (error) {
        console.error('Error fetching system settings:', error)
        return {
            allowNewRegistrations: false,
            currentAcademicYear: '2025-2026',
            defaultStudentFee: 60000,
            maintenanceMode: false
        }
    }
}

// Update System Settings
export async function updateSystemSettings(rawData: any) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== 'Super Admin') return { success: false, error: 'Unauthorized' }

        // 1. Zod Validation
        const validation = SettingsUpdateSchema.safeParse(rawData)
        if (!validation.success) {
            return { success: false, error: 'Invalid data format' }
        }
        const data = validation.data

        const existing = await prisma.systemSettings.findFirst()
        const id = existing?.id || 1

        // Track changes for high-fidelity audit
        const changeLog: any = {}
        if (existing) {
            Object.keys(data).forEach((key: string) => {
                const val = (data as any)[key]
                const oldVal = (existing as any)[key]
                if (val !== undefined && val !== oldVal) {
                    changeLog[key] = { from: oldVal, to: val }
                }
            })
        }

        const settings = await prisma.systemSettings.upsert({
            where: { id },
            update: {
                ...(data.maintenanceMode !== undefined && { maintenanceMode: data.maintenanceMode }),
                ...(data.allowNewRegistrations !== undefined && { allowNewRegistrations: data.allowNewRegistrations }),
                ...(data.staffReferralText !== undefined && { staffReferralText: data.staffReferralText }),
                ...(data.parentReferralText !== undefined && { parentReferralText: data.parentReferralText }),
                ...(data.staffWelcomeMessage !== undefined && { staffWelcomeMessage: data.staffWelcomeMessage }),
                ...(data.parentWelcomeMessage !== undefined && { parentWelcomeMessage: data.parentWelcomeMessage }),
                ...(data.alumniReferralText !== undefined && { alumniReferralText: data.alumniReferralText }),
                ...(data.alumniWelcomeMessage !== undefined && { alumniWelcomeMessage: data.alumniWelcomeMessage }),
            },
            create: {
                maintenanceMode: data.maintenanceMode || false,
                allowNewRegistrations: data.allowNewRegistrations ?? false,
                staffReferralText: data.staffReferralText,
                parentReferralText: data.parentReferralText,
                staffWelcomeMessage: data.staffWelcomeMessage,
                parentWelcomeMessage: data.parentWelcomeMessage,
                alumniReferralText: data.alumniReferralText,
                alumniWelcomeMessage: data.alumniWelcomeMessage
            }
        })

        if (Object.keys(changeLog).length > 0) {
            await logAction('UPDATE', 'settings', `Config updated by ${user.fullName}`, id.toString(), { changes: changeLog })
        }
        revalidatePath('/superadmin')
        return { success: true, data: settings }
    } catch (error) {
        console.error('Error updating system settings:', error)
        return { success: false, error: 'Failed to update system settings' }
    }
}

// --- Academic Year Actions ---

export async function getAcademicYears() {
    try {
        // @ts-ignore - Stale Prisma synchronization issue
        const years = await prisma.academicYear.findMany({
            orderBy: { startDate: 'desc' }
        })
        return { success: true, data: years }
    } catch (error) {
        console.error('Error getting academic years:', error)
        return { success: false, error: 'Failed' }
    }
}

export async function addAcademicYear(data: { year: string; startDate: Date; endDate: Date }) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== 'Super Admin') return { success: false, error: 'Unauthorized' }

        // @ts-ignore - Stale Prisma synchronization issue
        await prisma.academicYear.create({
            data: {
                year: data.year,
                startDate: data.startDate,
                endDate: data.endDate,
                isActive: true,
                isCurrent: false
            }
        })
        return { success: true }
    } catch (error) {
        console.error('Error adding academic year:', error)
        return { success: false, error: 'Failed to add year' }
    }
}

export async function setCurrentAcademicYear(yearString: string) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== 'Super Admin') return { success: false, error: 'Unauthorized' }

        // EXPERT: Sole source of truth is now the AcademicYear table.
        // SystemSettings no longer stores a duplicate string.
        await prisma.$transaction(async (tx) => {
            // Unset current for all
            // @ts-ignore - Stale Prisma synchronization issue
            await tx.academicYear.updateMany({
                data: { isCurrent: false }
            })

            // Set specific year as current
            // @ts-ignore - Stale Prisma synchronization issue
            await tx.academicYear.update({
                where: { year: yearString },
                data: { isCurrent: true }
            })
        })

        revalidatePath('/superadmin')
        return { success: true }
    } catch (error) {
        console.error('Error setting current academic year:', error)
        return { success: false, error: 'Failed to set current year' }
    }
}
