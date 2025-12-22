'use server'

import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { ROLE_PERMISSIONS } from '@/lib/permissions'

import { getCurrentUser } from '@/lib/auth-service'

// Get permissions for a role (from DB or fallback to defaults)
export async function getRolePermissions(role: string) {
    try {
        const dbPerms = await prisma.rolePermissions.findUnique({
            where: { role }
        })

        if (dbPerms) {
            return {
                success: true,
                permissions: {
                    analytics: { access: dbPerms.analyticsAccess, scope: dbPerms.analyticsScope },
                    userManagement: {
                        access: dbPerms.userMgmtAccess,
                        scope: dbPerms.userMgmtScope,
                        canCreate: dbPerms.userMgmtCreate,
                        canEdit: dbPerms.userMgmtEdit,
                        canDelete: dbPerms.userMgmtDelete
                    },
                    studentManagement: {
                        access: dbPerms.studentMgmtAccess,
                        scope: dbPerms.studentMgmtScope,
                        canCreate: true, // Defaulting to true for now
                        canEdit: true,
                        canDelete: true
                    },
                    adminManagement: {
                        access: dbPerms.adminMgmtAccess,
                        scope: dbPerms.adminMgmtScope,
                        canCreate: dbPerms.adminMgmtCreate,
                        canEdit: dbPerms.adminMgmtEdit,
                        canDelete: dbPerms.adminMgmtDelete
                    },
                    campusPerformance: { access: dbPerms.campusPerfAccess, scope: dbPerms.campusPerfScope },
                    reports: { access: dbPerms.reportsAccess, scope: dbPerms.reportsScope },
                    settlements: { access: dbPerms.settlementsAccess, scope: dbPerms.settlementsScope || 'none' },
                    marketingKit: { access: dbPerms.marketingKitAccess, scope: dbPerms.marketingKitScope || 'none' },
                    auditLog: { access: dbPerms.auditLogAccess, scope: dbPerms.auditLogScope || 'all' },
                    supportDesk: { access: dbPerms.supportDeskAccess, scope: dbPerms.supportDeskScope || 'all' },
                    settings: { access: dbPerms.settingsAccess, scope: dbPerms.settingsScope },
                    referralSubmission: { access: dbPerms.referralSubmissionAccess, scope: dbPerms.referralSubmissionScope || 'none' },
                    referralTracking: { access: dbPerms.referralTrackingAccess, scope: dbPerms.referralTrackingScope || 'none' },
                    savingsCalculator: { access: dbPerms.savingsCalculatorAccess, scope: dbPerms.savingsCalculatorScope || 'none' },
                    rulesAccess: { access: dbPerms.rulesAccessAccess, scope: dbPerms.rulesAccessScope || 'none' }
                }
            }
        }

        // Fallback to default permissions from code
        const defaultPerms = ROLE_PERMISSIONS[role]
        return { success: true, permissions: defaultPerms, isDefault: true }
    } catch (error) {
        console.error('Get permissions error:', error)
        return { success: false, error: 'Failed to get permissions' }
    }
}

// Update role permissions (Super Admin only)
export async function updateRolePermissions(role: string, permissions: any) {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Only Super Admin can update permissions' }
    }

    try {
        await prisma.rolePermissions.upsert({
            where: { role },
            create: {
                role,
                analyticsAccess: permissions.analytics.access,
                analyticsScope: permissions.analytics.scope,
                userMgmtAccess: permissions.userManagement.access,
                userMgmtScope: permissions.userManagement.scope,
                userMgmtCreate: permissions.userManagement.canCreate || false,
                userMgmtEdit: permissions.userManagement.canEdit || false,
                userMgmtDelete: permissions.userManagement.canDelete || false,
                studentMgmtAccess: permissions.studentManagement.access,
                studentMgmtScope: permissions.studentManagement.scope,
                adminMgmtAccess: permissions.adminManagement.access,
                adminMgmtScope: permissions.adminManagement.scope,
                adminMgmtCreate: permissions.adminManagement.canCreate || false,
                adminMgmtEdit: permissions.adminManagement.canEdit || false,
                adminMgmtDelete: permissions.adminManagement.canDelete || false,
                campusPerfAccess: permissions.campusPerformance.access,
                campusPerfScope: permissions.campusPerformance.scope,
                reportsAccess: permissions.reports.access,
                reportsScope: permissions.reports.scope,
                settlementsAccess: permissions.settlements.access,
                settlementsScope: permissions.settlements.scope,
                marketingKitAccess: permissions.marketingKit.access,
                marketingKitScope: permissions.marketingKit.scope,
                auditLogAccess: permissions.auditLog.access,
                auditLogScope: permissions.auditLog.scope,
                supportDeskAccess: permissions.supportDesk?.access ?? false,
                supportDeskScope: permissions.supportDesk?.scope ?? 'none',
                settingsAccess: permissions.settings?.access ?? false,
                settingsScope: permissions.settings?.scope ?? 'none',
                referralSubmissionAccess: permissions.referralSubmission?.access ?? false,
                referralSubmissionScope: permissions.referralSubmission?.scope ?? 'none',
                referralTrackingAccess: permissions.referralTracking?.access ?? false,
                referralTrackingScope: permissions.referralTracking?.scope ?? 'none',
                savingsCalculatorAccess: permissions.savingsCalculator?.access ?? false,
                savingsCalculatorScope: permissions.savingsCalculator?.scope ?? 'none',
                rulesAccessAccess: permissions.rulesAccess?.access ?? false,
                rulesAccessScope: permissions.rulesAccess?.scope ?? 'none',
                updatedBy: admin.fullName
            },
            update: {
                analyticsAccess: permissions.analytics.access,
                analyticsScope: permissions.analytics.scope,
                userMgmtAccess: permissions.userManagement.access,
                userMgmtScope: permissions.userManagement.scope,
                userMgmtCreate: permissions.userManagement.canCreate || false,
                userMgmtEdit: permissions.userManagement.canEdit || false,
                userMgmtDelete: permissions.userManagement.canDelete || false,
                studentMgmtAccess: permissions.studentManagement.access,
                studentMgmtScope: permissions.studentManagement.scope,
                adminMgmtAccess: permissions.adminManagement.access,
                adminMgmtScope: permissions.adminManagement.scope,
                adminMgmtCreate: permissions.adminManagement.canCreate || false,
                adminMgmtEdit: permissions.adminManagement.canEdit || false,
                adminMgmtDelete: permissions.adminManagement.canDelete || false,
                campusPerfAccess: permissions.campusPerformance.access,
                campusPerfScope: permissions.campusPerformance.scope,
                reportsAccess: permissions.reports.access,
                reportsScope: permissions.reports.scope,
                settlementsAccess: permissions.settlements.access,
                settlementsScope: permissions.settlements.scope,
                marketingKitAccess: permissions.marketingKit.access,
                marketingKitScope: permissions.marketingKit.scope,
                auditLogAccess: permissions.auditLog.access,
                auditLogScope: permissions.auditLog.scope,
                supportDeskAccess: permissions.supportDesk?.access ?? false,
                supportDeskScope: permissions.supportDesk?.scope ?? 'none',
                settingsAccess: permissions.settings?.access ?? false,
                settingsScope: permissions.settings?.scope ?? 'none',
                referralSubmissionAccess: permissions.referralSubmission?.access ?? false,
                referralSubmissionScope: permissions.referralSubmission?.scope ?? 'none',
                referralTrackingAccess: permissions.referralTracking?.access ?? false,
                referralTrackingScope: permissions.referralTracking?.scope ?? 'none',
                savingsCalculatorAccess: permissions.savingsCalculator?.access ?? false,
                savingsCalculatorScope: permissions.savingsCalculator?.scope ?? 'none',
                rulesAccessAccess: permissions.rulesAccess?.access ?? false,
                rulesAccessScope: permissions.rulesAccess?.scope ?? 'none',
                updatedBy: admin.fullName
            }
        })

        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Update permissions error:', error)
        return { success: false, error: 'Failed to update permissions' }
    }
}

// Reset role permissions to defaults
export async function resetRolePermissions(role: string) {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'Super Admin') {
        return { success: false, error: 'Only Super Admin can reset permissions' }
    }

    try {
        await prisma.rolePermissions.deleteMany({
            where: { role }
        })

        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Reset permissions error:', error)
        return { success: false, error: 'Failed to reset permissions' }
    }
}
