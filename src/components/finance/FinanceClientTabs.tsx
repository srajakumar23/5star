'use client'

import { useState } from 'react'
import { SettlementTable } from '@/components/finance/SettlementTable'
import { RegistrationTable } from '@/components/finance/RegistrationTable'

interface FinanceClientTabsProps {
    settlements: any[]
    registrations: any[]
}

export function FinanceClientTabs({ settlements, registrations }: FinanceClientTabsProps) {
    const [activeTab, setActiveTab] = useState<'payouts' | 'registrations'>('payouts')

    return (
        <div className="space-y-6">
            {/* Custom Premium Tabs */}
            <div className="flex p-1 bg-gray-100/50 rounded-2xl w-fit border border-gray-200">
                <button
                    onClick={() => setActiveTab('payouts')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'payouts' ? 'bg-white text-gray-900 shadow-md shadow-gray-200/50 scale-105' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    Payout Requests
                </button>
                <button
                    onClick={() => setActiveTab('registrations')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'registrations' ? 'bg-white text-emerald-700 shadow-md shadow-emerald-900/10 scale-105' : 'text-gray-500 hover:text-emerald-600'}`}
                >
                    Registration Fees (Incoming)
                </button>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'payouts' ? (
                    <SettlementTable data={settlements || []} />
                ) : (
                    <RegistrationTable data={registrations || []} />
                )}
            </div>
        </div>
    )
}
