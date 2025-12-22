import { getAllReferrals, getAdminAnalytics, confirmReferral } from '@/app/admin-actions'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-service'
import { AdminClient } from './admin-client'

export default async function AdminPage() {
    const user = await getCurrentUser()
    if (!user || !user.role.includes('Admin')) redirect('/dashboard')

    const referrals = await getAllReferrals()
    const analytics = await getAdminAnalytics()

    if (!analytics) return <div>Error loading analytics</div>

    return <AdminClient referrals={referrals} analytics={analytics} confirmReferral={confirmReferral} />
}
