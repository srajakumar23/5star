'use client'

import { useState } from 'react'
import { Rocket, Mail, CheckCircle2, AlertTriangle, Loader2, Users, Clock, Zap } from 'lucide-react'
import { triggerReengagementCampaign } from '@/app/engagement-actions'
import { toast } from 'sonner'
import { CampaignManager } from './CampaignManager'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

export function EngagementPanel() {
    const [activeTab, setActiveTab] = useState<'overview' | 'campaigns'>('overview')
    const [loading, setLoading] = useState(false)
    const [lastResult, setLastResult] = useState<{ sent: number, time: Date } | null>(null)

    // Confirmation State
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean
        data?: any
    }>({
        isOpen: false
    })

    const handleTriggerCampaign = () => {
        setConfirmState({ isOpen: true })
    }

    const executeTriggerCampaign = async () => {
        setConfirmState({ isOpen: false })
        setLoading(true)
        try {
            const res = await triggerReengagementCampaign()
            if (res.success) {
                const count = res.sentCount || 0
                setLastResult({ sent: count, time: new Date() })
                if (count > 0) toast.success(`Campaign triggered! Emails sent: ${count}`)
                else toast.info('Campaign scan complete. No inactive users found.')
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Tabs */}
            <div className="flex gap-4 border-b border-gray-100 pb-1">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-3 px-1 text-sm font-bold transition-colors relative ${activeTab === 'overview' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Quick Actions
                    {activeTab === 'overview' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('campaigns')}
                    className={`pb-3 px-1 text-sm font-bold transition-colors relative ${activeTab === 'campaigns' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Campaign Manager
                    {activeTab === 'campaigns' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-full" />}
                </button>
            </div>

            {activeTab === 'campaigns' ? (
                <CampaignManager />
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Legacy Quick Campaign Card */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl group-hover:bg-amber-100 transition-colors" />

                            <div className="relative">
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                                    <Zap size={24} />
                                </div>

                                <h3 className="font-bold text-gray-900 text-lg mb-2">Quick Re-engagement</h3>
                                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                    One-click boost. Automatically identifies ambassadors inactive for 14+ days and sends a standardized nudge.
                                </p>

                                <div className="bg-gray-50 rounded-lg p-3 mb-6 space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <Clock size={14} />
                                        <span>Target: Inactive (14 days)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <Mail size={14} />
                                        <span>Template: Standard Nudge</span>
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
                                            Scanning...
                                        </>
                                    ) : (
                                        <>
                                            <Rocket size={16} />
                                            Run Logic
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Status Card Logic (Preserved) */}
                        {lastResult && (
                            <div className="bg-green-50 rounded-2xl border border-green-100 p-6 shadow-md animate-in fade-in zoom-in duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-100 rounded-full text-green-700">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-green-900 text-lg mb-1">Execution Complete</h3>
                                        <div className="text-3xl font-black text-green-800 tracking-tight">
                                            {lastResult.sent}
                                        </div>
                                        <p className="text-xs font-bold text-green-600 uppercase tracking-widest mt-1">Emails Delivered</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Premium Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmState.isOpen}
                title="Run Re-engagement?"
                description={
                    <p>
                        Are you sure? This will send emails to <strong>ALL ambassadors</strong> inactive for 14+ days.
                    </p>
                }
                confirmText="Run Logic"
                variant="warning"
                onConfirm={executeTriggerCampaign}
                onCancel={() => setConfirmState({ isOpen: false })}
            />
        </div>
    )
}
