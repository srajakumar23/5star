'use client'

import { useEffect, useState } from 'react'
import { getUnsyncedLeads, markLeadSynced } from '@/lib/offline-storage'
import { submitReferral } from '@/app/referral-actions'
import { toast } from 'sonner'

export function OfflineSync() {
    const [isSyncing, setIsSyncing] = useState(false)

    const syncLeads = async () => {
        if (isSyncing) return

        const leads = await getUnsyncedLeads()
        if (leads.length === 0) return

        setIsSyncing(true)
        toast.info(`Syncing ${leads.length} offline leads...`, { id: 'offline-sync' })

        let successCount = 0
        let failCount = 0

        for (const lead of leads) {
            try {
                const res = await submitReferral({
                    parentName: lead.parentName,
                    parentMobile: lead.parentMobile,
                    studentName: lead.studentName,
                    campus: lead.campus,
                    gradeInterested: lead.gradeInterested
                }, lead.referralCode)

                if (res.success) {
                    if (lead.id) await markLeadSynced(lead.id)
                    successCount++
                } else {
                    failCount++
                }
            } catch (error) {
                failCount++
            }
        }

        setIsSyncing(false)

        if (successCount > 0) {
            toast.success(`Successfully synced ${successCount} leads!`, { id: 'offline-sync' })
        }
        if (failCount > 0) {
            toast.error(`Failed to sync ${failCount} leads. Will retry later.`, { id: 'offline-sync-error' })
        }
    }

    useEffect(() => {
        // Initial sync check
        if (navigator.onLine) {
            syncLeads()
        }

        const handleOnline = () => {
            syncLeads()
        }

        window.addEventListener('online', handleOnline)
        return () => window.removeEventListener('online', handleOnline)
    }, [])

    return null
}
