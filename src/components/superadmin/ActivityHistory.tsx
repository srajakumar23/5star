'use client'

import { useState, useEffect } from 'react'
import { Activity, Clock, FileText, Download, Filter, X, Calendar, Search, ArrowRight } from 'lucide-react'
import { getUserActivityHistory } from '@/app/user-audit-actions'

interface ActivityHistoryProps {
    userId: number
    userName: string
}

export function ActivityHistory({ userId, userName }: ActivityHistoryProps) {
    const [activities, setActivities] = useState<any[]>([])
    const [filteredActivities, setFilteredActivities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Filter states
    const [actionFilter, setActionFilter] = useState<string>('ALL')
    const [searchQuery, setSearchQuery] = useState('')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        const loadHistory = async () => {
            setLoading(true)
            const res = await getUserActivityHistory(userId)
            if (res.success && res.logs) {
                setActivities(res.logs)
                setFilteredActivities(res.logs)
            }
            setLoading(false)
        }
        loadHistory()
    }, [userId])

    // Apply filters
    useEffect(() => {
        let filtered = [...activities]

        // Action type filter
        if (actionFilter !== 'ALL') {
            filtered = filtered.filter(log => log.action === actionFilter)
        }

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(log =>
                log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.action.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Date range filter
        if (dateFrom) {
            filtered = filtered.filter(log => new Date(log.createdAt) >= new Date(dateFrom))
        }
        if (dateTo) {
            filtered = filtered.filter(log => new Date(log.createdAt) <= new Date(dateTo))
        }

        setFilteredActivities(filtered)
    }, [actionFilter, searchQuery, dateFrom, dateTo, activities])

    // Get unique action types
    const actionTypes = ['ALL', ...Array.from(new Set(activities.map(log => log.action)))]

    // Reset filters
    const resetFilters = () => {
        setActionFilter('ALL')
        setSearchQuery('')
        setDateFrom('')
        setDateTo('')
    }

    // Count active filters
    const activeFilterCount =
        (actionFilter !== 'ALL' ? 1 : 0) +
        (searchQuery ? 1 : 0) +
        (dateFrom ? 1 : 0) +
        (dateTo ? 1 : 0)

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['Timestamp', 'Action', 'Description', 'IP Address']
        const rows = filteredActivities.map(log => [
            new Date(log.createdAt).toLocaleString(),
            log.action,
            log.description,
            log.ipAddress || 'N/A'
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `activity-${userName}-${Date.now()}.csv`
        link.click()
        URL.revokeObjectURL(url)
    }

    // Enhanced description generator
    const getEnhancedDescription = (log: any) => {
        if (!log.metadata) return <p className="text-sm font-medium text-gray-700">{log.description}</p>

        const meta = log.metadata as any

        // Check for 'next' and 'previous' to show field changes
        if (meta.next && meta.previous) {
            const changes: string[] = []

            if (meta.next.role !== meta.previous.role) {
                changes.push(`Role: ${meta.previous.role} → ${meta.next.role}`)
            }
            if (meta.next.status !== meta.previous.status) {
                changes.push(`Status: ${meta.previous.status} → ${meta.next.status}`)
            }
            if (meta.next.email !== meta.previous.email && meta.previous.email !== 'nil') {
                changes.push(`Email updated`)
            }
            if (meta.next.campusId !== meta.previous.campusId) {
                changes.push(`Campus changed`)
            }

            if (changes.length > 0) {
                return (
                    <div>
                        <p className="text-sm font-medium text-gray-700">{log.description}</p>
                        <div className="mt-1 space-y-0.5">
                            {changes.map((change, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                                    <ArrowRight size={12} className="text-blue-500" />
                                    <span>{change}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
        }

        return <p className="text-sm font-medium text-gray-700">{log.description}</p>
    }

    if (loading) return <div className="p-8 text-center text-gray-400 text-xs font-bold animate-pulse">Loading activity trace...</div>

    if (activities.length === 0) return (
        <div className="p-8 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
            <Activity className="mx-auto text-gray-300 mb-2" size={24} />
            <p className="text-sm font-bold text-gray-900">No Recorded Activity</p>
            <p className="text-xs text-gray-400">This user hasn&apos;t performed any logged actions yet.</p>
        </div>
    )

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                        <Clock size={14} className="text-blue-500" />
                        Activity Timeline
                    </h4>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {filteredActivities.length} / {activities.length}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${showFilters || activeFilterCount > 0
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <Filter size={12} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="bg-white text-blue-500 rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-green-500 text-white hover:bg-green-600 transition-all"
                    >
                        <Download size={12} />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        {/* Action Type Filter */}
                        <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
                                Action Type
                            </label>
                            <select
                                value={actionFilter}
                                onChange={(e) => setActionFilter(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {actionTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Search */}
                        <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
                                Search
                            </label>
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search description..."
                                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Date From */}
                        <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
                                From Date
                            </label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Date To */}
                        <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">
                                To Date
                            </label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {activeFilterCount > 0 && (
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                        >
                            <X size={12} />
                            Reset Filters
                        </button>
                    )}
                </div>
            )}

            {/* Activity List */}
            <div className="max-h-[400px] overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {filteredActivities.length === 0 ? (
                    <div className="text-center py-8">
                        <Filter className="mx-auto text-gray-300 mb-2" size={24} />
                        <p className="text-sm font-bold text-gray-600">No activities match your filters</p>
                        <button
                            onClick={resetFilters}
                            className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Reset filters
                        </button>
                    </div>
                ) : (
                    filteredActivities.map((log) => (
                        <div key={log.id} className="relative pl-6 pb-4 last:pb-0 border-l border-gray-200 last:border-0 group">
                            <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-gray-300 border-2 border-white group-hover:bg-blue-500 transition-colors"></div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${log.action.includes('LOGIN') ? 'bg-green-50 text-green-700 border-green-100' :
                                            log.action.includes('UPDATE') ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                log.action.includes('DELETE') ? 'bg-red-50 text-red-700 border-red-100' :
                                                    'bg-gray-50 text-gray-600 border-gray-100'
                                        }`}>
                                        {log.action}
                                    </span>
                                    <span className="text-[10px] font-mono text-gray-400">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                {getEnhancedDescription(log)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
