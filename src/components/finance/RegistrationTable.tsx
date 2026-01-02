'use client'

import { useState } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { PremiumCard } from '@/components/premium/PremiumCard'
import { BadgeCheck, CreditCard, Download } from 'lucide-react'

interface RegistrationTableProps {
    data: any[]
}

export function RegistrationTable({ data }: RegistrationTableProps) {
    const [filter, setFilter] = useState('All')

    // Optional client-side filtering if needed in future
    // currently 'data' is already filtered by backend action to include only completed/process payments

    // Columns Definition
    const columns = [
        {
            header: 'User Details',
            accessorKey: 'fullName',
            cell: (row: any) => (
                <div>
                    <div className="font-bold text-gray-900 dark:text-white">{row.fullName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{row.mobileNumber}</div>
                </div>
            )
        },
        {
            header: 'Role',
            accessorKey: 'role',
            cell: (row: any) => (
                <span className="inline-flex px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-wider border border-gray-200">
                    {row.role}
                </span>
            ),
            filterable: true
        },
        {
            header: 'Campus',
            accessorKey: 'assignedCampus',
            cell: (row: any) => (row.assignedCampus ? row.assignedCampus : <span className="text-gray-300">-</span>),
            filterable: true
        },
        {
            header: 'Fee Paid',
            accessorKey: 'paymentAmount',
            cell: (row: any) => (
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold font-mono">
                    <span className="text-xs">₹</span>
                    {row.paymentAmount?.toLocaleString() || 0}
                </div>
            )
        },
        {
            header: 'Status',
            accessorKey: 'transactionId',
            cell: (row: any) => (
                <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                        <BadgeCheck size={10} strokeWidth={3} />
                        PAID
                    </span>
                    <span className="text-[9px] font-mono text-gray-400 tracking-wider">
                        REF: {row.transactionId || 'N/A'}
                    </span>
                </div>
            )
        },
        {
            header: 'Date',
            accessorKey: 'createdAt',
            // Use en-GB to match SettlementTable and avoid hydration errors
            cell: (row: any) => new Date(row.createdAt).toLocaleDateString('en-GB')
        }
    ]

    const handleExport = () => {
        // Simple CSV Export Logic
        const headers = ['Name,Mobile,Role,Campus,Amount,Transaction ID,Date']
        const rows = data.map(row => `${row.fullName},${row.mobileNumber},${row.role},${row.assignedCampus || ''},${row.paymentAmount},${row.transactionId},${new Date(row.createdAt).toLocaleDateString('en-GB')}`)

        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n")
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `registration_transactions_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-6">
            {/* Header / Actions */}
            <div className="flex justify-between items-center px-1">
                <div className="flex gap-2">
                    {/* Placeholder for future specific filters */}
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 flex items-center gap-2">
                        <CreditCard size={12} />
                        Registrations
                    </div>
                </div>

                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
                >
                    <Download size={14} />
                    Export CSV
                </button>
            </div>

            <PremiumCard>
                <div className="p-2">
                    <DataTable
                        data={data}
                        columns={columns}
                        searchKey="fullName"
                        pageSize={10}
                    />
                </div>
            </PremiumCard>
        </div>
    )
}
