'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { getAllReferrals, confirmReferral } from '@/app/admin-actions'
import { convertLeadToStudent } from '@/app/student-actions'
import { ReferralTable } from '@/app/(main)/admin/referral-table'

export function ReferralPanel() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialSearch = searchParams.get('search') || ''

    const [referrals, setReferrals] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const loadReferrals = async () => {
        setLoading(true)
        try {
            const res = await getAllReferrals()
            if (res.success && res.referrals) {
                setReferrals(res.referrals)
            } else {
                toast.error('Failed to load referrals')
            }
        } catch (e) {
            toast.error('An error occurred loading referrals')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadReferrals()
    }, [])

    const handleConfirmReferral = async (leadId: number) => {
        const res = await confirmReferral(leadId)
        if (res.success) {
            toast.success('Referral confirmed!')
            loadReferrals()
            router.refresh()
        } else {
            toast.error(res.error || 'Failed to confirm')
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading referrals...</div>
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <ReferralTable
                initialSearch={initialSearch}
                referrals={referrals}
                confirmReferral={handleConfirmReferral}
                convertLeadToStudent={convertLeadToStudent}
                isSuperAdmin={true} // Assuming super admin context
            />
        </div>
    )
}
