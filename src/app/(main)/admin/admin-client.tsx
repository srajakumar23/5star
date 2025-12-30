'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Users, TrendingUp, Award, BarChart3, DollarSign, CheckCircle, RefreshCw, Trophy, Building2, BookOpen, Shield, GraduationCap, Phone, Mail } from 'lucide-react'
import { ReferralTable } from './referral-table'
import { useState, useEffect } from 'react'
import { PremiumHeader } from '@/components/premium/PremiumHeader'
import { PremiumStatCard } from '@/components/premium/PremiumStatCard'
import { PremiumCard } from '@/components/premium/PremiumCard'
import { User, Student, ReferralLead, RolePermissions, AdminAnalytics, CampusPerformance, Admin, Campus } from '@/types'

interface AdminClientProps {
    referrals: ReferralLead[]
    analytics: AdminAnalytics
    confirmReferral: (leadId: number) => Promise<{ success: boolean; error?: string }>
    initialView?: string
    campuses?: Campus[]
    users?: User[]
    students?: Student[]
    admins?: Admin[]
    campusPerformance?: CampusPerformance[]
    permissions?: RolePermissions
}

export function AdminClient({ referrals, analytics, confirmReferral, initialView = 'analytics', campuses = [], users = [], students = [], admins = [], campusPerformance = [], permissions }: AdminClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [statusFilter, setStatusFilter] = useState<string>('All')

    // Filters for Admins View
    const [adminSearch, setAdminSearch] = useState('')
    const [adminRoleFilter, setAdminRoleFilter] = useState('All')

    // Filters for Users View
    const [filterRole, setFilterRole] = useState('All')
    const [filterCampus, setFilterCampus] = useState('All')
    const [filterStatus, setFilterStatus] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')

    // Filters for Students View
    const [studentSearch, setStudentSearch] = useState('')
    const [studentCampusFilter, setStudentCampusFilter] = useState('All')
    const [studentGradeFilter, setStudentGradeFilter] = useState('All')

    // View state
    const [selectedView, setSelectedView] = useState<string>(initialView)

    // Sync state with URL
    useEffect(() => {
        const view = searchParams.get('view') || 'home'
        setSelectedView(view)
    }, [searchParams])

    const handleCardClick = (filter: string) => {
        setStatusFilter(filter)
    }

    const getTitle = () => {
        switch (selectedView) {
            case 'campuses': return 'Campus Management';
            case 'users': return 'User Directory';
            case 'admins': return 'Admin Management';
            case 'students': return 'Student Management';
            case 'home': return 'Dashboard';
            default: return 'Analytics Overview';
        }
    }

    const getSubtitle = () => {
        switch (selectedView) {
            case 'campuses': return 'View and manage campus details';
            case 'users': return 'View all system users';
            case 'admins': return 'Manage system administrators';
            case 'students': return 'View registered students';
            case 'home': return 'Quick overview and actions';
            default: return 'Operational insights and lead conversion';
        }
    }

    return (
        <div className="animate-fade-in space-y-8">
            {/* Premium Header */}
            <PremiumHeader
                title={getTitle()}
                subtitle={getSubtitle()}
                icon={BarChart3}
                action={
                    <button
                        onClick={() => router.refresh()}
                        className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 transition-all shadow-sm hover:shadow-md backdrop-blur-sm"
                    >
                        <RefreshCw size={16} /> Refresh
                    </button>
                }
            />

            {/* CONTENT VIEWS */}

            {/* HOME VIEW - Action Focused */}
            {selectedView === 'home' && (
                <div className="space-y-8">
                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <PremiumStatCard
                            title="Total Leads"
                            value={analytics?.totalLeads || 0}
                            icon={Users}
                            color="red"
                        />
                        <PremiumStatCard
                            title="Confirmed"
                            value={analytics?.confirmedLeads || 0}
                            icon={CheckCircle}
                            color="green"
                        />
                        <PremiumStatCard
                            title="Pending"
                            value={analytics?.pendingLeads || 0}
                            icon={BarChart3}
                            color="amber"
                        />
                        <PremiumStatCard
                            title="Conversion"
                            value={`${analytics?.conversionRate || 0}%`}
                            icon={TrendingUp}
                            color="purple"
                        />
                    </div>

                    {/* Quick Actions */}
                    <PremiumCard title="Quick Actions" icon={TrendingUp}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button
                                onClick={() => router.push('/admin?view=campuses')}
                                className="flex flex-col items-center gap-3 p-6 bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-red-500/10 border border-gray-100 hover:border-red-100 rounded-2xl transition-all group"
                            >
                                <div className="p-3 bg-red-50 rounded-xl group-hover:scale-110 transition-transform">
                                    <Building2 size={24} className="text-red-600" />
                                </div>
                                <span className="text-sm font-bold text-gray-700">Campuses</span>
                            </button>
                            <button
                                onClick={() => router.push('/admin?view=users')}
                                className="flex flex-col items-center gap-3 p-6 bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-blue-500/10 border border-gray-100 hover:border-blue-100 rounded-2xl transition-all group"
                            >
                                <div className="p-3 bg-blue-50 rounded-xl group-hover:scale-110 transition-transform">
                                    <Users size={24} className="text-blue-600" />
                                </div>
                                <span className="text-sm font-bold text-gray-700">Users</span>
                            </button>
                            <button
                                onClick={() => router.push('/admin?view=students')}
                                className="flex flex-col items-center gap-3 p-6 bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-green-500/10 border border-gray-100 hover:border-green-100 rounded-2xl transition-all group"
                            >
                                <div className="p-3 bg-green-50 rounded-xl group-hover:scale-110 transition-transform">
                                    <BookOpen size={24} className="text-green-600" />
                                </div>
                                <span className="text-sm font-bold text-gray-700">Students</span>
                            </button>
                            <button
                                onClick={() => router.push('/admin?view=analytics')}
                                className="flex flex-col items-center gap-3 p-6 bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-purple-500/10 border border-gray-100 hover:border-purple-100 rounded-2xl transition-all group"
                            >
                                <div className="p-3 bg-purple-50 rounded-xl group-hover:scale-110 transition-transform">
                                    <BarChart3 size={24} className="text-purple-600" />
                                </div>
                                <span className="text-sm font-bold text-gray-700">Full Analytics</span>
                            </button>
                        </div>
                    </PremiumCard>

                    {/* Top Performers & Role Distribution */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PremiumCard title="Top Performers" icon={Trophy}>
                            <div className="space-y-4">
                                {(analytics?.topPerformers || []).slice(0, 5).map((performer: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 rounded-2xl transition-all">
                                        <div className="flex items-center gap-4">
                                            <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                                            <div>
                                                <span className="text-sm font-bold text-gray-800 block">{performer.name}</span>
                                                <p className="text-xs text-gray-500 font-medium">{performer.role}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-green-600">{performer.count}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">leads</p>
                                        </div>
                                    </div>
                                ))}
                                {(!analytics?.topPerformers || analytics.topPerformers.length === 0) && (
                                    <p className="text-center text-gray-400 text-sm py-4">No data available</p>
                                )}
                            </div>
                        </PremiumCard>

                        <PremiumCard title="Role Distribution" icon={Users}>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-red-50/50 border border-red-100 rounded-2xl">
                                    <span className="text-sm font-bold text-gray-700">Parents</span>
                                    <span className="text-xl font-black text-red-600">{analytics?.roleBreakdown?.parent?.count || 0}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-green-50/50 border border-green-100 rounded-2xl">
                                    <span className="text-sm font-bold text-gray-700">Staff</span>
                                    <span className="text-xl font-black text-green-600">{analytics?.roleBreakdown?.staff?.count || 0}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                                    <span className="text-sm font-bold text-gray-700">Total Ambassadors</span>
                                    <span className="text-xl font-black text-blue-600">{analytics?.totalAmbassadors || 0}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-purple-50/50 border border-purple-100 rounded-2xl">
                                    <span className="text-sm font-bold text-gray-700">Est. Value</span>
                                    <span className="text-xl font-black text-purple-600">₹{(analytics?.totalEstimatedValue || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </PremiumCard>
                    </div>
                </div>
            )}

            {/* CAMPUSES VIEW */}
            {selectedView === 'campuses' && (
                <div className="space-y-6">
                    {/* Summary Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm text-center">
                            <p className="text-3xl font-black text-red-600">{campusPerformance.length}</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Total Campuses</p>
                        </div>
                        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm text-center">
                            <p className="text-3xl font-black text-amber-500">{campusPerformance.reduce((sum, c) => sum + c.totalLeads, 0)}</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Total Leads</p>
                        </div>
                        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm text-center">
                            <p className="text-3xl font-black text-green-500">{campusPerformance.reduce((sum, c) => sum + c.confirmed, 0)}</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Confirmed</p>
                        </div>
                        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm text-center">
                            <p className="text-3xl font-black text-purple-500">
                                {(campusPerformance.reduce((sum, c) => sum + c.totalLeads, 0) > 0
                                    ? ((campusPerformance.reduce((sum, c) => sum + c.confirmed, 0) / campusPerformance.reduce((sum, c) => sum + c.totalLeads, 0)) * 100).toFixed(1)
                                    : '0')}%
                            </p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Avg Conversion</p>
                        </div>
                    </div>

                    {/* Lead Distribution Chart */}
                    <PremiumCard title="Lead Distribution by Campus">
                        <div className="space-y-4">
                            {campusPerformance.map((campus) => {
                                const maxLeads = Math.max(...campusPerformance.map(c => c.totalLeads))
                                const widthPercent = maxLeads > 0 ? (campus.totalLeads / maxLeads) * 100 : 0

                                return (
                                    <div key={campus.campus} className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-bold text-gray-700">{campus.campus}</span>
                                            <span className="text-gray-500 font-medium">{campus.totalLeads} leads</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
                                                style={{ width: `${widthPercent}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </PremiumCard>

                    {/* Desktop Table */}
                    <PremiumCard title="Campus Performance Details" noPadding>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Campus</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Total Leads</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Confirmed</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Pending</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Conversion</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Ambassadors</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {campusPerformance.map((campus) => (
                                        <tr key={campus.campus} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-800">{campus.campus}</td>
                                            <td className="px-6 py-4 text-center font-semibold text-gray-600">{campus.totalLeads}</td>
                                            <td className="px-6 py-4 text-center font-bold text-green-600">{campus.confirmed}</td>
                                            <td className="px-6 py-4 text-center font-semibold text-amber-600">{campus.pending}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${campus.conversionRate >= 80 ? 'bg-green-100 text-green-700' : campus.conversionRate >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                    {campus.conversionRate}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center font-medium text-gray-500">{campus.ambassadors}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </PremiumCard>
                </div>
            )}

            {/* ANALYTICS VIEW (Default) */}
            {(selectedView === 'analytics' || !selectedView) && (
                <div className="space-y-8">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <PremiumStatCard
                            title="Total Leads"
                            value={analytics?.totalLeads || 0}
                            icon={Users}
                            color="red"
                            subValue={`${analytics?.conversionRate || 0}% Conversion`}
                            onClick={() => handleCardClick('All')}
                        />
                        <PremiumStatCard
                            title="Confirmed"
                            value={analytics?.confirmedLeads || 0}
                            icon={CheckCircle}
                            color="green"
                            subValue="Verified Enrollments"
                            onClick={() => handleCardClick('Confirmed')}
                        />
                        <PremiumStatCard
                            title="Est. Value"
                            value={`₹${(analytics?.totalEstimatedValue || 0).toLocaleString()}`}
                            icon={DollarSign}
                            color="indigo"
                            subValue="Incentive Value"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PremiumCard title="Role Distribution" icon={BarChart3}>
                            <div className="space-y-6 py-4">
                                <div>
                                    <div className="flex justify-between mb-2 text-sm font-bold">
                                        <span className="text-gray-700">Parents</span>
                                        <span className="text-red-600">{analytics?.roleBreakdown?.parent?.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3">
                                        <div className="bg-red-500 h-full rounded-full transition-all duration-1000" style={{ width: `${analytics?.roleBreakdown?.parent?.percentage}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2 text-sm font-bold">
                                        <span className="text-gray-700">Staff</span>
                                        <span className="text-green-600">{analytics?.roleBreakdown?.staff?.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3">
                                        <div className="bg-green-500 h-full rounded-full transition-all duration-1000" style={{ width: `${analytics?.roleBreakdown?.staff?.percentage}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </PremiumCard>

                        <PremiumCard title="Top Performers" icon={Trophy}>
                            <div className="space-y-3">
                                {analytics.topPerformers.map((performer, idx) => (
                                    <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl transition-all ${idx === 0 ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50 border-transparent border'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${idx === 0 ? 'bg-amber-200 text-amber-800' : 'bg-white text-gray-500 shadow-sm'}`}>
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{performer.name}</p>
                                                <p className="text-xs text-gray-500 font-medium">{performer.role} • {performer.referralCode}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-red-600">{performer.count}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">leads</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PremiumCard>
                    </div>

                    <ReferralTable
                        referrals={referrals}
                        confirmReferral={confirmReferral}
                        initialStatusFilter={statusFilter}
                    />
                </div>
            )}

            {/* USERS VIEW */}
            {selectedView === 'users' && (
                <div className="space-y-6">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-gray-900">{users.length}</p>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Users</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-gray-900">{users.filter(u => u.role === 'Staff').length}</p>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Staff Members</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <Award size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-gray-900">{users.filter(u => u.role === 'Parent').length}</p>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Parents</p>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex-1 min-w-[200px]">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                            />
                        </div>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium text-gray-700"
                        >
                            <option value="All">All Roles</option>
                            <option value="Parent">Parent</option>
                            <option value="Staff">Staff</option>
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium text-gray-700"
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Table */}
                    <PremiumCard title="User Directory" noPadding>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Mobile</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Campus</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Referrals</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {users
                                        .filter((user) => {
                                            const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                user.mobileNumber.includes(searchQuery)
                                            const matchesRole = filterRole === 'All' || user.role === filterRole
                                            const matchesStatus = filterStatus === 'All' || user.status === filterStatus
                                            return matchesSearch && matchesRole && matchesStatus
                                        })
                                        .map((user) => (
                                            <tr key={user.userId} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-gray-800">{user.fullName}</td>
                                                <td className="px-6 py-4 font-medium text-gray-600">{user.mobileNumber}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${user.role === 'Staff' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-600">{user.assignedCampus || '-'}</td>
                                                <td className="px-6 py-4 text-center font-bold text-gray-800">{user.confirmedReferralCount}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </PremiumCard>
                </div>
            )}

            {/* ADMINS VIEW (Newly Added) */}
            {selectedView === 'admins' && (
                <div className="space-y-6">
                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex-1 min-w-[200px]">
                            <input
                                type="text"
                                placeholder="Search admins..."
                                value={adminSearch}
                                onChange={(e) => setAdminSearch(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <PremiumCard title="System Administrators" icon={Shield} noPadding>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Campus</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Last Active</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {admins
                                        .filter(admin => admin.name.toLowerCase().includes(adminSearch.toLowerCase()))
                                        .map((admin, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-gray-800">{admin.name}</td>
                                                <td className="px-6 py-4 font-medium text-gray-600">{admin.email}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                                                        {admin.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-600">{admin.campus || 'All Campuses'}</td>
                                                <td className="px-6 py-4 text-center text-gray-500 text-sm">
                                                    {new Date().toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </PremiumCard>
                </div>
            )}

            {/* STUDENTS VIEW (Newly Added) */}
            {selectedView === 'students' && (
                <div className="space-y-6">
                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex-1 min-w-[200px]">
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={studentSearch}
                                onChange={(e) => setStudentSearch(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <PremiumCard title="Registered Students" icon={GraduationCap} noPadding>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Grade</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Campus</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Parent Info</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {students
                                        .filter(student => student.name.toLowerCase().includes(studentSearch.toLowerCase()))
                                        .map((student) => (
                                            <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-gray-800">{student.name}</td>
                                                <td className="px-6 py-4 text-gray-600 font-medium">{student.grade}</td>
                                                <td className="px-6 py-4 text-gray-600 font-medium">{student.campus}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col text-sm">
                                                        <span className="font-bold text-gray-700">{student.parentName}</span>
                                                        <span className="text-gray-500 text-xs">{student.parentPhone}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                        Active
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </PremiumCard>
                </div>
            )}
        </div>
    )
}
