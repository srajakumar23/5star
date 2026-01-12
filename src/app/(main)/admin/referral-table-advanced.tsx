'use client'

import { useState, useEffect, useTransition, Fragment } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ChevronRight, CheckCircle, Filter, ChevronDown, Clock, AlertCircle, Phone, MapPin, User, Search, Square, CheckSquare, Trash, XCircle, Download, X, Pencil, ArrowUp, ArrowDown, RefreshCcw, Layout, Calendar, CreditCard, Hash, Shield, Key } from 'lucide-react'
import { PremiumCard } from '@/components/premium/PremiumCard'
import { toast } from 'sonner'
import { bulkRejectReferrals, bulkDeleteReferrals, bulkConfirmReferrals, bulkConvertLeadsToStudents, exportReferrals } from '@/app/admin-actions'

interface ReferralManagementTableProps {
    referrals: any[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
    isReadOnly?: boolean
    onBulkAdd?: () => void
}

export function ReferralManagementTable({
    referrals,
    meta,
    isReadOnly = false,
    onBulkAdd,
    confirmReferral, // Added prop for single confirm action
    convertLeadToStudent, // Added prop for single convert action
    rejectReferral // Added prop for single reject action
}: ReferralManagementTableProps & {
    confirmReferral?: (leadId: number, erp?: string) => Promise<any>
    convertLeadToStudent?: (leadId: number, details: any) => Promise<{ success: boolean; error?: string }>
    rejectReferral?: (leadId: number) => Promise<{ success: boolean; error?: string }>
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    // --- State ---
    // Filters (Mirror URL params)
    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [status, setStatus] = useState(searchParams.get('status') || 'All')
    const [role, setRole] = useState(searchParams.get('role') || 'All')
    const [campus, setCampus] = useState(searchParams.get('campus') || 'All')
    const [dateFrom, setDateFrom] = useState(searchParams.get('from') || '')
    const [dateTo, setDateTo] = useState(searchParams.get('to') || '')

    // Live Mode
    const [isLive, setIsLive] = useState(false)

    // Polling Effect
    useEffect(() => {
        if (!isLive) return
        const interval = setInterval(() => {
            router.refresh()
            toast.success('Data refreshed', { duration: 1000, icon: <RefreshCcw size={12} /> })
        }, 10000) // 30s might be better but 10s is responsive
        return () => clearInterval(interval)
    }, [isLive, router])

    // Dynamic Columns
    const [showColumns, setShowColumns] = useState({
        erp: true,
        parentMobile: true,
        campus: true,
        leadDetails: true,
        role: true,
        date: true
    })
    const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false)

    // Selection
    const [selectedIds, setSelectedIds] = useState<number[]>([])

    // Debounce Search
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (searchParams.get('search') || '')) {
                updateParam('search', search)
            }
        }, 500)
        return () => clearTimeout(timeout)
    }, [search])

    // Expanded Row State
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null)
    const [confirmingId, setConfirmingId] = useState<number | null>(null)
    const [erpInput, setErpInput] = useState('')

    // --- Helpers ---
    function updateParam(key: string, value: string) {
        const params = new URLSearchParams(searchParams)
        if (value && value !== 'All') {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        params.set('page', '1') // Reset to page 1 on filter change
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`)
        })
    }

    function handlePageChange(newPage: number) {
        const params = new URLSearchParams(searchParams)
        params.set('page', newPage.toString())
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`)
        })
    }

    // Toggle Selection
    const toggleSelectAll = () => {
        if (selectedIds.length === referrals.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(referrals.map(r => r.leadId))
        }
    }

    const toggleSelect = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id))
        } else {
            setSelectedIds([...selectedIds, id])
        }
    }

    const toggleRow = (id: number) => {
        setExpandedRowId(expandedRowId === id ? null : id)
    }

    // --- Bulk Actions ---
    const handleBulkConfirm = async () => {
        if (!confirm(`Confirm ${selectedIds.length} referrals? Only those with existing ERP numbers found in import will be processed.`)) return
        const tid = toast.loading('Processing Confirmations...')
        const res = await bulkConfirmReferrals(selectedIds)
        if (res.success) {
            toast.success(`Processed ${res.processed} referrals`, { id: tid })
            setSelectedIds([])
            router.refresh()
        } else {
            toast.error(res.error, { id: tid })
        }
    }

    const handleBulkAddToStudent = async () => {
        if (!confirm(`Add ${selectedIds.length} leads to Student Database? This will create student profiles.`)) return
        const tid = toast.loading('Adding Students...')
        const res = await bulkConvertLeadsToStudents(selectedIds)
        if (res.success) {
            toast.success(`Processed ${res.processed} students`, { id: tid })
            if (res.errors && res.errors.length > 0) {
                toast.warning(`${res.errors.length} failed. Check console.`)
            }
            setSelectedIds([])
            router.refresh()
        } else {
            toast.error(res.error, { id: tid })
        }
    }

    const handleBulkReject = async () => {
        if (!confirm(`Reject ${selectedIds.length} referrals?`)) return
        const tid = toast.loading('Rejecting...')
        const res = await bulkRejectReferrals(selectedIds)
        if (res.success) {
            toast.success('Rejected successfully', { id: tid })
            setSelectedIds([])
            router.refresh()
        } else {
            toast.error(res.error, { id: tid })
        }
    }

    const handleExport = async () => {
        const tid = toast.loading('Generating CSV...')
        try {
            const res = await exportReferrals({
                status: status !== 'All' ? status : undefined,
                role: role !== 'All' ? role : undefined,
                campus: campus !== 'All' ? campus : undefined,
                search: search || undefined,
                dateRange: (dateFrom && dateTo) ? { from: dateFrom, to: dateTo } : undefined
            })

            if (res.success && res.csv) {
                const blob = new Blob([res.csv], { type: 'text/csv' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `referrals-export-${new Date().toISOString().split('T')[0]}.csv`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                toast.success('Download started', { id: tid })
            } else {
                toast.error(res.error || 'Export failed', { id: tid })
            }
        } catch (e) {
            toast.error('Export error', { id: tid })
        }
    }

    const handleBulkDelete = async () => {
        if (!confirm(`Permanently DELETE ${selectedIds.length} referrals?`)) return
        const tid = toast.loading('Deleting...')
        const res = await bulkDeleteReferrals(selectedIds)
        if (res.success) {
            toast.success('Deleted successfully', { id: tid })
            setSelectedIds([])
            router.refresh()
        } else {
            toast.error(res.error, { id: tid })
        }
    }


    return (
        <PremiumCard>
            {/* Header / Stats Row Placeholder if needed */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-50 text-red-600 rounded-xl relative">
                        <User size={20} strokeWidth={2.5} />
                        {isPending && (
                            <div className="absolute inset-0 bg-white/50 animate-pulse rounded-xl" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                            Global Referral System (v2)
                            {isPending && <RefreshCcw size={14} className="animate-spin text-gray-400" />}
                        </h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                            Page {meta.page} of {meta.totalPages} • {meta.total} Total
                        </p>
                    </div>
                </div>

            </div>

            <div className="flex items-center gap-2">
                {/* Live Toggle */}
                <button
                    onClick={() => setIsLive(!isLive)}
                    suppressHydrationWarning={true}
                    className={`px-3 py-2 border rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${isLive ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-white border-gray-200 text-gray-500'}`}
                    title="Auto-refresh every 10s"
                >
                    <RefreshCcw size={14} className={isLive ? 'animate-spin' : ''} />
                    {isLive ? 'Live' : 'Off'}
                </button>

                {/* Export */}
                <button
                    onClick={handleExport}
                    suppressHydrationWarning={true}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-gray-50 text-gray-700"
                >
                    <Download size={14} /> Export
                </button>

                {/* Column Toggle */}
                <div className="relative">
                    <button
                        onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-gray-50"
                    >
                        <Layout size={14} /> Columns
                    </button>
                    {isColumnMenuOpen && (
                        <div className="absolute right-0 top-12 bg-white border border-gray-100 shadow-xl rounded-xl p-3 w-48 z-50 animate-in fade-in slide-in-from-top-2">
                            <h4 className="text-[10px] font-black uppercase text-gray-400 mb-2">Toggle Columns</h4>
                            {Object.keys(showColumns).map(key => (
                                <label key={key} className="flex items-center gap-2 text-sm p-1.5 hover:bg-gray-50 rounded cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={(showColumns as any)[key]}
                                        onChange={(e) => setShowColumns({ ...showColumns, [key]: e.target.checked })}
                                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {onBulkAdd && !isReadOnly && (
                    <button
                        onClick={onBulkAdd}
                        suppressHydrationWarning={true}
                        className="px-4 py-2 bg-gray-900 text-white rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-black transition-transform active:scale-95 shadow-lg shadow-gray-200"
                    >
                        <Download size={14} /> Import
                    </button>
                )}
            </div>


            {/* Filters */}
            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search parents, students, mobile..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        suppressHydrationWarning={true}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm font-medium"
                    />
                </div>

                <select
                    value={role}
                    onChange={(e) => {
                        setRole(e.target.value)
                        updateParam('role', e.target.value)
                    }}
                    suppressHydrationWarning={true}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 text-sm font-medium text-gray-700"
                >
                    <option value="All">All Roles</option>
                    <option value="Parent">Parent</option>
                    <option value="Staff">Staff</option>
                </select>

                <select
                    value={campus}
                    onChange={(e) => {
                        setCampus(e.target.value)
                        updateParam('campus', e.target.value)
                    }}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 text-sm font-medium text-gray-700 max-w-[150px]"
                >
                    <option value="All">All Campuses</option>
                    {/* Assuming parent passes unique campuses or we fetch them elsewhere. For now, basic list or 'All' */}
                    {/* Dynamic list should be passed in props ideally, but for now we rely on inputs or pre-knowns */}
                    <option value="JIPMER Campus">JIPMER Campus</option>
                    <option value="Main Campus">Main Campus</option>
                </select>

                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value)
                        updateParam('status', e.target.value)
                    }}
                    suppressHydrationWarning={true}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 text-sm font-medium text-gray-700"
                >
                    <option value="All">All Status</option>
                    <option value="New">New</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Rejected">Rejected</option>
                </select>

                {/* Date Range */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-2">
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => {
                            setDateFrom(e.target.value)
                            updateParam('from', e.target.value)
                        }}
                        className="py-2 text-sm font-medium text-gray-700 focus:outline-none"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => {
                            setDateTo(e.target.value)
                            updateParam('to', e.target.value)
                        }}
                        className="py-2 text-sm font-medium text-gray-700 focus:outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 w-10">
                                <button onClick={toggleSelectAll} className="text-gray-400 hover:text-gray-600">
                                    {selectedIds.length > 0 && selectedIds.length === referrals.length ? <CheckSquare size={20} className="text-red-600" /> : <Square size={20} />}
                                </button>
                            </th>
                            <th className="px-6 py-4 w-10"></th>
                            {showColumns.role && <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Referrer</th>}
                            {showColumns.leadDetails && <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Lead Details</th>}
                            {showColumns.campus && <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Campus</th>}
                            {showColumns.erp && <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">ERP Info</th>}
                            {showColumns.date && <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>}
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {referrals.map((r: any) => {
                            const isSelected = selectedIds.includes(r.leadId)
                            return (
                                <Fragment key={r.leadId}>
                                    <tr className={`transition-colors group ${isSelected ? 'bg-red-50/30' : 'hover:bg-gray-50/80'}`}>
                                        <td className="px-6 py-4">
                                            <button onClick={() => toggleSelect(r.leadId)} className="text-gray-400 hover:text-gray-600">
                                                {isSelected ? <CheckSquare size={20} className="text-red-600" /> : <Square size={20} />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => toggleRow(r.leadId)} className="text-gray-400 hover:text-gray-800 transition-colors p-1 hover:bg-gray-100 rounded-lg">
                                                {expandedRowId === r.leadId ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                            </button>
                                        </td>

                                        {showColumns.role && (
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${r.user.role === 'Staff' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                                        <User size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{r.user.fullName}</p>
                                                        <span className={`text-[10px] font-bold uppercase ${r.user.role === 'Staff' ? 'text-red-500' : 'text-blue-500'}`}>{r.user.role}</span>
                                                    </div>
                                                </div>
                                            </td>
                                        )}

                                        {showColumns.leadDetails && (
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-gray-900">{r.parentName}</p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                    <Phone size={12} /> {r.parentMobile}
                                                </div>
                                                {(r.gradeInterested || r.section) && (
                                                    <p className="text-xs text-gray-400 mt-0.5">{r.gradeInterested} {r.section ? `(${r.section})` : ''}</p>
                                                )}
                                            </td>
                                        )}

                                        {showColumns.campus && (
                                            <td className="px-6 py-4 text-center text-sm text-gray-600">
                                                {r.campus || '-'}
                                            </td>
                                        )}

                                        {showColumns.erp && (
                                            <td className="px-6 py-4 text-center">
                                                {r.admissionNumber ? (
                                                    <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-700">{r.admissionNumber}</span>
                                                ) : (
                                                    <span className="text-gray-300 text-xs">-</span>
                                                )}
                                            </td>
                                        )}

                                        {showColumns.date && (
                                            <td className="px-6 py-4 text-center text-xs text-gray-500">
                                                {(() => {
                                                    const d = new Date(r.createdAt)
                                                    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
                                                })()}
                                            </td>
                                        )}

                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold border ${r.leadStatus === 'Confirmed' ? 'bg-green-50 text-green-600 border-green-100' :
                                                r.leadStatus === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                                    r.leadStatus === 'Follow-up' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        'bg-gray-50 text-gray-600 border-gray-100'
                                                }`}>
                                                {r.leadStatus}
                                            </span>
                                        </td>
                                    </tr>
                                    {
                                        expandedRowId === r.leadId && (
                                            <tr className="bg-gray-50/50">
                                                <td colSpan={10} className="p-0 border-b border-gray-200">
                                                    <div className="p-8 bg-gradient-to-br from-gray-50/80 to-white shadow-inner">
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                                            {/* Section 1: Lead Information */}
                                                            <div className="space-y-3">
                                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                                    <User size={12} className="text-gray-500" />
                                                                    Lead Information
                                                                </h4>
                                                                <div>
                                                                    <p className="text-lg font-bold text-gray-900">{r.parentName}</p>
                                                                    <p className="text-sm text-gray-500 font-medium flex items-center gap-2 mt-1">
                                                                        <Phone size={12} /> {r.parentMobile}
                                                                    </p>
                                                                    {(r.gradeInterested || r.section) && (
                                                                        <p className="text-xs text-gray-600 bg-gray-100 inline-block px-2 py-1 rounded mt-2 font-semibold">
                                                                            Interested in: {r.gradeInterested} {r.section ? `(${r.section})` : ''}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Section 2: Referrer Information */}
                                                            <div className="space-y-3">
                                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                                    <User size={12} className="text-blue-500" />
                                                                    Referrer
                                                                </h4>
                                                                <div>
                                                                    <p className="text-sm font-bold text-gray-900">{r.user.fullName}</p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${r.user.role === 'Staff' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                                                            {r.user.role}
                                                                        </span>
                                                                        <span className="text-xs text-gray-400 font-mono">
                                                                            #{r.user.referralCode}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Section 3: Status & Timeline */}
                                                            <div className="space-y-3">
                                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                                    <Clock size={12} className="text-amber-500" />
                                                                    Timeline
                                                                </h4>
                                                                <div className="space-y-1">
                                                                    <div className="flex justify-between text-xs">
                                                                        <span className="text-gray-500">Created:</span>
                                                                        <span className="font-medium text-gray-900">
                                                                            {(() => {
                                                                                const d = new Date(r.createdAt)
                                                                                return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
                                                                            })()}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between text-xs">
                                                                        <span className="text-gray-500">Status:</span>
                                                                        <span className={`font-bold ${r.leadStatus === 'Confirmed' ? 'text-green-600' : 'text-gray-900'}`}>{r.leadStatus}</span>
                                                                    </div>
                                                                    {r.admissionNumber && (
                                                                        <div className="flex justify-between text-xs pt-1 border-t border-gray-100 mt-1">
                                                                            <span className="text-gray-500">ERP No:</span>
                                                                            <span className="font-mono font-bold text-gray-900">{r.admissionNumber}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Section 4: Quick Actions */}
                                                            <div className="space-y-3 border-l border-gray-100 pl-6">
                                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                                    Actions
                                                                </h4>
                                                                <div className="flex flex-col gap-2">
                                                                    {!isReadOnly && r.leadStatus !== 'Confirmed' && confirmReferral && (
                                                                        <>
                                                                            {confirmingId === r.leadId ? (
                                                                                <div className="flex gap-2 animate-in fade-in slide-in-from-top-1">
                                                                                    <input
                                                                                        autoFocus
                                                                                        type="text"
                                                                                        placeholder="Enter ERP No..."
                                                                                        value={erpInput}
                                                                                        onChange={(e) => setErpInput(e.target.value)}
                                                                                        className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                                                                                    />
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            if (!erpInput.trim()) return toast.error('ERP Number is required')
                                                                                            confirmReferral(r.leadId, erpInput).then(res => {
                                                                                                if (res.success) {
                                                                                                    toast.success('Confirmed!')
                                                                                                    setConfirmingId(null)
                                                                                                    setErpInput('')
                                                                                                    router.refresh()
                                                                                                } else toast.error(res.error)
                                                                                            })
                                                                                        }}
                                                                                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold"
                                                                                    >
                                                                                        Save
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            setConfirmingId(null)
                                                                                            setErpInput('')
                                                                                        }}
                                                                                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-bold"
                                                                                    >
                                                                                        Cancel
                                                                                    </button>
                                                                                </div>
                                                                            ) : (
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setConfirmingId(r.leadId)
                                                                                        setErpInput('')
                                                                                    }}
                                                                                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm hover:translate-x-1"
                                                                                >
                                                                                    Confirm Admission
                                                                                </button>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                    {!isReadOnly && r.leadStatus !== 'Confirmed' && rejectReferral && (
                                                                        <button
                                                                            onClick={() => {
                                                                                if (confirm('Reject this referral? This cannot be undone.')) {
                                                                                    rejectReferral(r.leadId).then(res => {
                                                                                        if (res.success) {
                                                                                            toast.success('Referral rejected')
                                                                                            router.refresh()
                                                                                        } else toast.error(res.error)
                                                                                    })
                                                                                }
                                                                            }}
                                                                            className="w-full py-2 bg-white border border-gray-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition-all"
                                                                        >
                                                                            Reject Referral
                                                                        </button>
                                                                    )}
                                                                    {!isReadOnly && r.leadStatus === 'Confirmed' && !r.student && convertLeadToStudent && (
                                                                        <button
                                                                            onClick={() => {
                                                                                if (confirm('Add to Student Database?')) {
                                                                                    convertLeadToStudent(r.leadId, { studentName: r.parentName + "'s Child" }).then(res => {
                                                                                        if (res.success) {
                                                                                            toast.success('Added to Students!')
                                                                                            router.refresh()
                                                                                        } else toast.error(res.error)
                                                                                    })
                                                                                }
                                                                            }}
                                                                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm hover:translate-x-1"
                                                                        >
                                                                            Add to Students
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }
                                </Fragment>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-6">
                <button
                    disabled={meta.page <= 1}
                    onClick={() => handlePageChange(meta.page - 1)}
                    className="px-4 py-2 text-sm font-bold text-gray-600 disabled:opacity-50 hover:bg-gray-50 rounded-lg transition-colors"
                >
                    Previous
                </button>
                <span className="text-xs font-medium text-gray-400">Page {meta.page} of {meta.totalPages}</span>
                <button
                    disabled={meta.page >= meta.totalPages}
                    onClick={() => handlePageChange(meta.page + 1)}
                    className="px-4 py-2 text-sm font-bold text-gray-600 disabled:opacity-50 hover:bg-gray-50 rounded-lg transition-colors"
                >
                    Next
                </button>
            </div >

            {/* Floating Batch Actions */}
            {
                selectedIds.length > 0 && !isReadOnly && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5">
                        <div className="bg-[#0f172a] text-white p-2 pl-6 pr-2 rounded-full shadow-2xl flex items-center gap-4 border border-gray-800 ring-4 ring-black/5">
                            <div className="font-bold text-sm">
                                <span className="text-red-400">{selectedIds.length}</span> Selected
                            </div>
                            <div className="h-4 w-px bg-gray-700" />
                            <div className="flex items-center gap-2">
                                <button onClick={handleBulkConfirm} className="px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-xs font-bold transition-colors">
                                    Approve
                                </button>
                                <button onClick={handleBulkAddToStudent} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold transition-colors">
                                    Add to Students
                                </button>
                                <button onClick={handleBulkReject} className="p-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors" title="Reject">
                                    <XCircle size={18} />
                                </button>
                                <button onClick={handleBulkDelete} className="p-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors" title="Delete">
                                    <Trash size={18} />
                                </button>
                            </div>
                            <button onClick={() => setSelectedIds([])} className="ml-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400">
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                )
            }
        </PremiumCard >
    )
}
