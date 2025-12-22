import { getCurrentUser } from '@/lib/auth-service'
import { redirect } from 'next/navigation'
import { getCampusAnalytics, getCampusReferrals, confirmCampusReferral } from '@/app/campus-actions'
import { CampusClient } from './campus-client'

export default async function CampusPage() {
    const user = await getCurrentUser()

    // Only Campus Heads and Super Admin can access this page
    if (!user || (!user.role.includes('CampusHead') && user.role !== 'Super Admin')) {
        redirect('/dashboard')
    }

    // For now, we'll use a campus from the user's referrals
    // In production, you'd have an assignedCampus field in the database
    const assignedCampus = 'ADYAR' // TODO: Get from user.assignedCampus once database is updated

    const analytics = await getCampusAnalytics(assignedCampus)
    const referrals = await getCampusReferrals(assignedCampus)

    if (!analytics) {
        return <div>Error loading campus analytics</div>
    }

    return <CampusClient
        campus={assignedCampus}
        analytics={analytics}
        referrals={referrals}
        confirmReferral={confirmCampusReferral}
    />
}
