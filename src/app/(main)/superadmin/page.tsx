import { getCurrentUser } from '@/lib/auth-service'
import { redirect } from 'next/navigation'
import { getSystemAnalytics, getCampusComparison, getAllUsers, getAllAdmins, getAllStudents } from '@/app/superadmin-actions'
import SuperadminClient from './superadmin-client'

interface PageProps {
    searchParams: Promise<{ view?: string }>
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

    // Get view from URL params (default to 'analytics')
    const initialView = params.view || 'analytics'

    // Fetch all data
    const analytics = await getSystemAnalytics()
    const campusComparison = await getCampusComparison()
    const users = await getAllUsers()
    const admins = await getAllAdmins()
    const students = await getAllStudents()

    return (
        <SuperadminClient
            analytics={analytics}
            campusComparison={campusComparison}
            users={users}
            admins={admins}
            students={students}
            currentUser={user}
            initialView={initialView}
        />
    )
}

