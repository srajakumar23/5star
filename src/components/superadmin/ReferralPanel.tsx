'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { getAllReferrals, confirmReferral } from '@/app/admin-actions'
import { convertLeadToStudent } from '@/app/student-actions'
import { ReferralTable } from '@/app/(main)/admin/referral-table'
import CSVUploader from '@/components/CSVUploader'

export function ReferralPanel() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialSearch = searchParams.get('search') || ''

    const [referrals, setReferrals] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showBulkUpload, setShowBulkUpload] = useState(false)

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

    const handleConfirmReferral = async (leadId: number, admissionNumber?: string) => {
        const res = await confirmReferral(leadId, admissionNumber)
        if (res.success) {
            toast.success('Referral confirmed!')
            loadReferrals()
            router.refresh()
        } else {
            return res
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading referrals...</div>
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-black text-gray-900 tracking-tighter hidden md:block">Referral Management</h1>
            </div>

            <ReferralTable
                referrals={referrals}
                confirmReferral={handleConfirmReferral}
                convertLeadToStudent={convertLeadToStudent}
                onBulkAdd={() => setShowBulkUpload(true)}
            />

            {showBulkUpload && (
                <CSVUploader
                    type="referrals"
                    onClose={() => setShowBulkUpload(false)}
                    onUpload={async () => {
                        await loadReferrals()
                        return { success: true, added: 0, failed: 0, errors: [] }
                    }}
                />
            )}
        </div>
    )
}
