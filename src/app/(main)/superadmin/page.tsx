import { getCurrentUser } from '@/lib/auth-service'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { isIpWhitelisted } from '@/lib/security'
import { getSystemAnalytics, getCampusComparison, getAllUsers, getAllAdmins, getAllStudents, getUserGrowthTrend } from '@/app/superadmin-actions'
import { getAdminMarketingAssets } from '@/app/marketing-actions'
import { getSystemSettings, getSecuritySettings } from '@/app/settings-actions'
import SuperadminClient from './superadmin-client' // Client component
import { ErrorBoundary } from '@/components/ErrorBoundary'

interface PageProps {
    searchParams: Promise<{ view?: string }>
}

// Helper function to serialize dates in objects
function serializeData<T>(data: T): T {
    if (data === null || data === undefined) return data
    if (data instanceof Date) return data.toISOString() as unknown as T
    if (Array.isArray(data)) return data.map(item => serializeData(item)) as unknown as T
    if (typeof data === 'object') {
        const serialized: any = {}
        for (const key in data) {
            serialized[key] = serializeData((data as any)[key])
        }
        return serialized as T
    }
    return data
}

export default async function SuperadminPage({ searchParams }: PageProps) {
    const user = await getCurrentUser()
    const params = await searchParams

    if (!user) {
        redirect('/')
    }

    // Check if user is Super Admin (strict check)
    if (user.role !== 'Super Admin') {
        redirect('/dashboard')
    }

    // --- SECURITY ENFORCEMENT: IP WHITELIST ---
    const securitySettings = await getSecuritySettings() as any
    if (securitySettings?.ipWhitelist) {
        const headersList = await headers()
        const clientIp = headersList.get('x-forwarded-for')?.split(',')[0] ||
            headersList.get('x-real-ip') ||
            'unknown'

        if (!isIpWhitelisted(clientIp, securitySettings.ipWhitelist as any)) {
            console.warn(`Unauthorized Super Admin access attempt from IP: ${clientIp}`)
            redirect('/unauthorized-ip')
        }
    }

    // --- SECURITY ENFORCEMENT: 2FA ---
    if (securitySettings?.twoFactorAuthEnabled) {
        const session = await getSession()
        if (!session || session.is2faVerified === false) {
            console.log(`2FA required for Super Admin: ${user.fullName}`)
            redirect('/auth/verify-2fa')
        }
    }

    // Get view from URL params (default to 'home')
    const initialView = params.view || 'home'

    // Fetch all data
    const analytics = await getSystemAnalytics()
    const campusComparison = await getCampusComparison()
    const users = await getAllUsers()
    const admins = await getAllAdmins()
    const students = await getAllStudents()
    const marketingAssets = await getAdminMarketingAssets()
    const systemSettings = await getSystemSettings()
    const growthTrend = await getUserGrowthTrend()
    // Helper to get count
    const { getUrgentTicketCount } = await import('@/app/ticket-actions')
    const urgentTicketCount = await getUrgentTicketCount()

    return (
        <ErrorBoundary>
            <SuperadminClient
                analytics={analytics}
                campusComparison={campusComparison}
                users={serializeData(users) as any}
                admins={serializeData(admins) as any}
                students={serializeData(students) as any}
                currentUser={serializeData(user) as any}
                initialView={initialView}
                marketingAssets={serializeData(marketingAssets.assets) as any}
                systemSettings={serializeData(systemSettings) as any}
                growthTrend={growthTrend}
                urgentTicketCount={urgentTicketCount}
            />
        </ErrorBoundary>
    )
}


