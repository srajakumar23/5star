'use client'

import { useState } from 'react'
import { Rocket, Mail, CheckCircle2, AlertTriangle, Loader2, Users, Clock } from 'lucide-react'
import { triggerReengagementCampaign } from '@/app/engagement-actions'
import { toast } from 'sonner'

export function EngagementPanel() {
    const [loading, setLoading] = useState(false)
    const [lastResult, setLastResult] = useState<{ sent: number, time: Date } | null>(null)

    const handleTriggerCampaign = async () => {
        if (!confirm('Are you sure? This will send emails to ALL ambassadors inactive for 14+ days.')) return

        setLoading(true)
        try {
            const res = await triggerReengagementCampaign()
            if (res.success) {
                const count = res.sentCount || 0
                setLastResult({ sent: count, time: new Date() })
                if (count > 0) {
                    toast.success(`Campaign triggered! Emails sent: ${count}`)
                } else {
                    toast.info('Campaign scan complete. No inactive users found needing follow-up.')
                }
            } else {
                toast.error(res.error || 'Campaign failed')
            }
        } catch (error) {
            toast.error('Unexpected error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Engagement Campaigns</h2>
                    <p className="text-sm text-gray-500 mt-1">Automated re-engagement workflows</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Re-engagement Campaign Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl group-hover:bg-red-100 transition-colors" />

                    <div className="relative">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-4">
                            <Rocket size={24} />
                        </div>

                        <h3 className="font-bold text-gray-900 text-lg mb-2">Inactive Re-engagement</h3>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            Automatically identifies ambassadors inactive for 14+ days and sends a personalized email with their current badge status to encourage return.
                        </p>

                        <div className="bg-gray-50 rounded-lg p-3 mb-6 space-y-2">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Clock size={14} />
                                <span>Frequency: Manual / Weekly</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Users size={14} />
                                <span>Target: Inactive (14 days)</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Mail size={14} />
                                <span>Limit: Once per 30 days</span>
                            </div>
                        </div>

                        <button
                            onClick={handleTriggerCampaign}
                            disabled={loading}
                            className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm shadow-lg shadow-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Scanning & Sending...
                                </>
                            ) : (
                                <>
                                    <Rocket size={16} />
                                    Run Campaign Now
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Status Card */}
                {lastResult && (
                    <div className="bg-green-50 rounded-2xl border border-green-100 p-6 shadow-md animate-in fade-in zoom-in duration-300">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-100 rounded-full text-green-700">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-green-900 text-lg mb-1">Last Run Successful</h3>
                                <p className="text-sm text-green-700 mb-4">
                                    Completed at {lastResult.time.toLocaleTimeString()}
                                </p>
                                <div className="text-3xl font-black text-green-800 tracking-tight">
                                    {lastResult.sent}
                                </div>
                                <p className="text-xs font-bold text-green-600 uppercase tracking-widest mt-1">Emails Sent</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
