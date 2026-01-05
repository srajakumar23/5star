'use client'

import React from 'react'
import { Calendar, Building2, Users, SlidersHorizontal, ChevronDown } from 'lucide-react'

interface FilterBarProps {
    filters: any
    onFilterChange: (newFilters: any) => void
    campuses: string[]
}

export function GlobalFilterBar({ filters, onFilterChange, campuses }: FilterBarProps) {
    const presets = [
        { id: '7d', label: 'Last 7 Days' },
        { id: '30d', label: 'Last 30 Days' },
        { id: '90d', label: 'Last Quarter' },
        { id: 'all', label: 'All Time' }
    ]

    return (
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-[28px] p-4 shadow-xl shadow-gray-200/20 flex flex-wrap items-center gap-6">
            {/* Date Preset Filter */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Calendar size={18} />
                </div>
                <div className="flex bg-gray-100/50 p-1 rounded-2xl gap-1">
                    {presets.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => onFilterChange({
                                ...filters,
                                dateRange: { ...filters.dateRange, preset: preset.id }
                            })}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${filters.dateRange?.preset === preset.id
                                    ? 'bg-white text-red-600 shadow-md'
                                    : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-8 w-px bg-gray-200 hidden lg:block" />

            {/* Campus Filter */}
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Building2 size={18} />
                </div>
                <div className="relative flex-1">
                    <select
                        value={filters.campus || 'All'}
                        onChange={(e) => onFilterChange({ ...filters, campus: e.target.value })}
                        className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-red-500 transition-all font-bold text-sm appearance-none"
                    >
                        <option value="All">All Campuses</option>
                        {campuses.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-3 min-w-[180px]">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users size={18} />
                </div>
                <div className="relative flex-1">
                    <select
                        value={filters.role || 'All'}
                        onChange={(e) => onFilterChange({ ...filters, role: e.target.value })}
                        className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-red-500 transition-all font-bold text-sm appearance-none"
                    >
                        <option value="All">All Roles</option>
                        <option value="Parent">Parents</option>
                        <option value="Staff">Staff</option>
                        <option value="Alumni">Alumni</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <button
                onClick={() => onFilterChange({ dateRange: { preset: 'all' }, campus: 'All', role: 'All' })}
                className="p-3 bg-gray-50 hover:bg-white text-gray-400 hover:text-red-500 border border-gray-200 rounded-xl transition-all shadow-sm flex items-center gap-2"
                title="Reset Filters"
            >
                <SlidersHorizontal size={18} />
            </button>
        </div>
    )
}
