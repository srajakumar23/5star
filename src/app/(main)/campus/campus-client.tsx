'use client'

import { Users, TrendingUp, Award, BarChart3, DollarSign, CheckCircle, Building2 } from 'lucide-react'
import { ReferralTable } from '../admin/referral-table'
import { useState } from 'react'

interface CampusClientProps {
    campus: string
    analytics: any
    referrals: any[]
    confirmReferral: (leadId: number, campus: string) => Promise<any>
}

export function CampusClient({ campus, analytics, referrals, confirmReferral }: CampusClientProps) {
    const [statusFilter, setStatusFilter] = useState<string>('All')

    const handleCardClick = (filter: string) => {
        setStatusFilter(filter)
    }

    const confirmReferralWrapper = async (leadId: number) => {
        await confirmReferral(leadId, campus)
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Campus Dashboard</h1>
                    <p className="text-text-secondary flex items-center gap-2 mt-1">
                        <Building2 size={16} />
                        {campus} Campus
                    </p>
                </div>
            </div>

            {/* Campus KPI Cards - Compact & Clickable */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-8">
                {/* Total Leads - Achariya Red Gradient */}
                <div
                    className="card p-4 relative overflow-hidden cursor-pointer transition-transform hover:scale-105"
                    style={{
                        background: 'linear-gradient(135deg, #CC0000 0%, #EC1C24 100%)',
                        border: statusFilter === 'All' ? '3px solid #8B0000' : 'none',
                        color: 'white'
                    }}
                    onClick={() => handleCardClick('All')}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-white/80 text-xs mb-1">Total Leads</p>
                            <h2 className="text-3xl font-bold text-white">{analytics.totalLeads}</h2>
                        </div>
                        <div className="p-2 bg-white/20 rounded-full">
                            <BarChart3 size={20} />
                        </div>
                    </div>
                </div>

                {/* Confirmed - Green Gradient */}
                <div
                    className="card p-4 relative overflow-hidden cursor-pointer transition-transform hover:scale-105"
                    style={{
                        background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                        border: statusFilter === 'Confirmed' ? '3px solid #065F46' : 'none',
                        color: 'white'
                    }}
                    onClick={() => handleCardClick('Confirmed')}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-white/80 text-xs mb-1">Confirmed</p>
                            <h2 className="text-3xl font-bold text-white">{analytics.confirmedLeads}</h2>
                        </div>
                        <div className="p-2 bg-white/20 rounded-full">
                            <CheckCircle size={20} />
                        </div>
                    </div>
                </div>

                {/* Pending - Orange Gradient */}
                <div
                    className="card p-4 relative overflow-hidden cursor-pointer transition-transform hover:scale-105"
                    style={{
                        background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                        border: statusFilter === 'Pending' ? '3px solid #B45309' : 'none',
                        color: 'white'
                    }}
                    onClick={() => handleCardClick('Pending')}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-white/80 text-xs mb-1">Pending</p>
                            <h2 className="text-3xl font-bold text-white">{analytics.pendingLeads}</h2>
                        </div>
                        <div className="p-2 bg-white/20 rounded-full">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                </div>

                {/* Conversion Rate - Achariya Gold Gradient */}
                <div
                    className="card p-4 relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #F59E0B 0%, #FFD936 100%)',
                        border: 'none',
                        color: 'white'
                    }}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-white/80 text-xs mb-1">Conversion Rate</p>
                            <h2 className="text-3xl font-bold text-white">{analytics.conversionRate}%</h2>
                        </div>
                        <div className="p-2 bg-white/20 rounded-full">
                            <Award size={20} />
                        </div>
                    </div>
                </div>

                {/* Total Ambassadors - Achariya Red Variant */}
                <div
                    className="card p-4 relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #DC2626 0%, #F87171 100%)',
                        border: 'none',
                        color: 'white'
                    }}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-white/80 text-xs mb-1">Ambassadors</p>
                            <h2 className="text-3xl font-bold text-white">{analytics.totalAmbassadors}</h2>
                        </div>
                        <div className="p-2 bg-white/20 rounded-full">
                            <Users size={20} />
                        </div>
                    </div>
                </div>

                {/* Total Est. Value - Achariya Gold Variant */}
                <div
                    className="card p-4 relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #D97706 0%, #FCD34D 100%)',
                        border: 'none',
                        color: 'white'
                    }}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-white/80 text-xs mb-1">Est. Benefits</p>
                            <h2 className="text-2xl font-bold text-white">₹{Math.round(analytics.totalEstimatedValue / 1000)}K</h2>
                        </div>
                        <div className="p-2 bg-white/20 rounded-full">
                            <DollarSign size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Role Breakdown */}
                <div className="card p-6">
                    <h3 className="text-xl font-bold mb-4">Role Breakdown</h3>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">Parents</span>
                                <span className="text-text-secondary">{analytics.roleBreakdown.parent.count} ({analytics.roleBreakdown.parent.percentage}%)</span>
                            </div>
                            <div className="w-full bg-bg-input rounded-full h-2">
                                <div
                                    className="h-2 rounded-full"
                                    style={{
                                        width: `${analytics.roleBreakdown.parent.percentage}%`,
                                        background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)'
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">Staff</span>
                                <span className="text-text-secondary">{analytics.roleBreakdown.staff.count} ({analytics.roleBreakdown.staff.percentage}%)</span>
                            </div>
                            <div className="w-full bg-bg-input rounded-full h-2">
                                <div
                                    className="h-2 rounded-full"
                                    style={{
                                        width: `${analytics.roleBreakdown.staff.percentage}%`,
                                        background: 'linear-gradient(90deg, #FFD936 0%, #FCD34D 100%)'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Pipeline */}
                <div className="card p-6">
                    <h3 className="text-xl font-bold mb-4">Status Pipeline</h3>
                    <div className="space-y-3">
                        {analytics.statusBreakdown.map((item: any, idx: number) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium">{item.status}</span>
                                    <span className="text-text-secondary">{item.count} ({item.percentage}%)</span>
                                </div>
                                <div className="w-full bg-bg-input rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full"
                                        style={{
                                            width: `${item.percentage}%`,
                                            background: item.status === 'Confirmed'
                                                ? '#10B981'
                                                : item.status === 'Follow-up'
                                                    ? '#F59E0B'
                                                    : '#6B7280'
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Performers for this campus */}
                <div className="card p-6 lg:col-span-2">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Award className="text-primary-red" size={24} />
                        Top Performers - {campus}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {analytics.topPerformers.map((performer: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded" style={{
                                background: idx === 0
                                    ? 'linear-gradient(90deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)'
                                    : 'var(--bg-input)'
                            }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white" style={{
                                        background: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : '#6B7280'
                                    }}>
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{performer.name}</p>
                                        <p className="text-xs text-text-secondary">{performer.role}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-primary-red">{performer.count}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Referrals Table */}
            <ReferralTable
                referrals={referrals}
                confirmReferral={confirmReferralWrapper}
                initialStatusFilter={statusFilter === 'Pending' ? 'All' : statusFilter}
                key={statusFilter}
            />
        </div>
    )
}
