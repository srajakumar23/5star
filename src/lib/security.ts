/**
 * Security utilities for backend enforcement.
 */

/**
 * Checks if a given IP address is in the whitelist.
 * Supports comma-separated list of individual IPs.
 * TODO: Add CIDR support in the future if needed.
 */
export function isIpWhitelisted(ip: string, whitelist: string | null | undefined): boolean {
    if (!whitelist || whitelist.trim() === '') {
        return true // No whitelist defined, allow all
    }

    const allowedIps = whitelist
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '')

    // Check for exact match
    if (allowedIps.includes(ip)) {
        return true
    }

    // Localhost handling
    if (ip === '::1' || ip === '127.0.0.1') {
        return true
    }

    return false
}
