import 'server-only'
import { getRolePermissions } from '@/app/permission-actions'
import { getCurrentUser } from './auth-service'
import { ROLE_PERMISSIONS, RolePermissions } from './permissions'

/**
 * Get permissions for the currently logged-in admin
 */
export async function getMyPermissions() {
    const user = await getCurrentUser()
    if (!user) return null

    const result = await getRolePermissions(user.role)
    if (result.success) {
        return result.permissions as RolePermissions
    }

    // Fallback to coded defaults if DB fetch fails or role not in DB
    return ROLE_PERMISSIONS[user.role] as RolePermissions || null
}

/**
 * Check if the current user has access to a specific module
 */
export async function hasPermission(module: keyof RolePermissions) {
    const perms = await getMyPermissions()
    if (!perms) return false

    // Note: Super Admin permissions are also managed via the matrix, 
    // but defaults ensure they have full access.
    return perms[module]?.access || false
}

/**
 * Get the data scope for the current user and module
 */
export async function getPermissionScope(module: keyof RolePermissions) {
    const perms = await getMyPermissions()
    if (!perms) return 'none'
    return perms[module]?.scope || 'none'
}
