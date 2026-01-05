'use client'

import React, { useState, useMemo } from 'react'
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Download, Filter } from 'lucide-react'

interface Column {
    header: string
    key: string
    render?: (value: any, row: any) => React.ReactNode
}

interface InteractiveDataTableProps {
    data: any[]
    columns: Column[]
    pageSize?: number
    title?: string
}

export function InteractiveDataTable({ data, columns, pageSize = 10, title }: InteractiveDataTableProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

    // 1. Filter Logic
    const filteredData = useMemo(() => {
        return data.filter(item =>
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
    }, [data, searchTerm])

    // 2. Sort Logic
    const sortedData = useMemo(() => {
        const sorted = [...filteredData]
        if (sortConfig !== null) {
            sorted.sort((a, b) => {
                const aVal = a[sortConfig.key]
                const bVal = b[sortConfig.key]
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
                return 0
            })
        }
        return sorted
    }, [filteredData, sortConfig])

    // 3. Pagination Logic
    const totalPages = Math.ceil(sortedData.length / pageSize)
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return sortedData.slice(start, start + pageSize)
    }, [sortedData, currentPage, pageSize])

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    const exportToCSV = () => {
        const headers = columns.map(c => c.header).join(',')
        const rows = sortedData.map(row =>
            columns.map(c => `"${String(row[c.key] || '')}"`).join(',')
        ).join('\n')
        const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${title || 'export'}_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
    }

    return (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col h-full">
            {/* Header / Toolbar */}
            <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search records..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="w-full pl-11 pr-5 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/5 transition-all font-medium text-sm"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all font-bold text-xs shadow-lg shadow-gray-200"
                    >
                        <Download size={14} />
                        Export Sorted
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-x-auto min-h-[400px]">
                <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-white z-10 border-b border-gray-100 shadow-sm">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    onClick={() => handleSort(col.key)}
                                    className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-gray-900 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        {col.header}
                                        <ArrowUpDown size={12} className={sortConfig?.key === col.key ? 'text-red-500' : ''} />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/80 transition-colors group">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-6 py-5 text-sm font-bold text-gray-700">
                                            {col.render ? col.render(row[col.key], row) : (row[col.key] || '-')}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="py-20 text-center font-bold text-gray-400 italic bg-gray-50/20">
                                    No data found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="p-6 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/30">
                <p className="text-xs font-bold text-gray-400 uppercase">
                    Showing <span className="text-gray-900">{Math.min(sortedData.length, (currentPage - 1) * pageSize + 1)}</span> to <span className="text-gray-900">{Math.min(sortedData.length, currentPage * pageSize)}</span> of <span className="text-gray-900">{sortedData.length}</span> results
                </p>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum = currentPage
                            if (totalPages <= 5) pageNum = i + 1
                            else {
                                if (currentPage <= 3) pageNum = i + 1
                                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
                                else pageNum = currentPage - 2 + i
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${currentPage === pageNum
                                            ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                                            : 'bg-white text-gray-500 hover:text-gray-900 border border-transparent hover:border-gray-200'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            )
                        })}
                    </div>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}
