'use client'

import { useState } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { PaymentModal } from './PaymentModal'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { PremiumCard } from '@/components/premium/PremiumCard'

interface SettlementTableProps {
    data: any[]
}

export function SettlementTable({ data }: SettlementTableProps) {
    const [filter, setFilter] = useState('Pending')
    const [selectedSettlement, setSelectedSettlement] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Derived state for filtering
    const filteredData = data.filter(item => {
        if (filter === 'All') return true
        return item.status === filter
    })

    const columns = [
        {
            header: 'Ambassador',
            accessorKey: 'user.fullName',
            cell: (row: any) => (
                <div>
                    <div className="font-bold text-gray-900 dark:text-white">{row.user.fullName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{row.user.role} • {row.user.mobileNumber}</div>
                </div>
            )
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            cell: (row: any) => <span className="font-bold font-mono text-primary-red dark:text-red-400">₹{row.amount.toLocaleString()}</span>
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (row: any) => {
                const statusStyles: any = {
                    'Pending': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800',
                    'Processed': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800',
                }
                const Icons: any = {
                    'Pending': <Clock size={12} />,
                    'Processed': <CheckCircle size={12} />
                }
                return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyles[row.status] || 'bg-gray-100 text-gray-800'}`}>
                        {Icons[row.status]}
                        {row.status}
                    </span>
                )
            }
        },
        {
            header: 'Date',
            accessorKey: 'createdAt',
            // Use a fixed locale to avoid hydration mismatch (Server US vs Client IN)
            cell: (row: any) => new Date(row.createdAt).toLocaleDateString('en-GB')
        },
        {
            header: 'Action',
            accessorKey: 'id', // Required by DataTable standard
            cell: (row: any) => {
                if (row.status === 'Processed') return <span className="text-xs text-gray-400 dark:text-gray-500">Paid on {new Date(row.payoutDate).toLocaleDateString('en-GB')}</span>

                return (
                    <button
                        onClick={() => {
                            setSelectedSettlement(row)
                            setIsModalOpen(true)
                        }}
                        className="bg-black text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors shadow-sm dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                        Pay Now
                    </button>
                )
            }
        }
    ]

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex gap-2">
                {['Pending', 'Processed', 'All'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === f
                            ? 'bg-primary-red text-white shadow-lg shadow-red-900/20'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <PremiumCard>
                <div className="p-2">
                    <DataTable
                        data={filteredData}
                        columns={columns}
                        searchKey="user.fullName"
                    />
                </div>
            </PremiumCard>

            <PaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                settlement={selectedSettlement}
                onSuccess={() => {
                    // In a real app we might trigger a refresh, but here the server action revalidates the path
                    // so the data should update on next render or we can force refresh if needed.
                    // For now, the parent page revalidation handles it.
                }}
            />
        </div>
    )
}
