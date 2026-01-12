'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Download, Clock, CheckCircle2, MoreVertical, FileDown } from 'lucide-react'
import { motion } from 'framer-motion'

// Mock Data matching the user's structure
const PRE_ASSET_REFERRALS = [
    {
        id: 1,
        name: 'Bala',
        details: 'ASM - MOOLAKULAM • Grade-6 • 2025-2026',
        status: 'New',
        type: 'Pre-Asset'
    },
    {
        id: 2,
        name: 'Sarah Johnson',
        details: 'TVS - MAIN CAMPUS • Grade-4 • 2025-2026',
        status: 'Contacted',
        type: 'Pre-Asset'
    }
]

const ASSET_REFERRALS = [
    // Empty for now to show empty state, or add one to demonstrate
]

export default function ReferralsDesignPage() {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-[family-name:var(--font-outfit)] pb-20">
            {/* Ambient Background Effects - Deep Royal Theme */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-lg mx-auto min-h-screen flex flex-col p-6">

                {/* Header */}
                <header className="flex items-center justify-between mb-8 pt-4">
                    <div className="flex items-center gap-4">
                        <Link href="/design/blue-teal" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                            <ChevronLeft size={20} className="text-white/80" />
                        </Link>
                        <h1 className="text-2xl font-black tracking-tight text-white">My Referrals</h1>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all shadow-sm group">
                        <FileDown size={16} className="text-white/70 group-hover:text-white" />
                        <span className="text-sm font-bold text-white/70 group-hover:text-white">Download PDF</span>
                    </button>
                </header>

                {/* SECTION 1: PRE-ASSET */}
                <div className="mb-8">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-4 pl-4 border-l-4 border-amber-400">
                        <h2 className="text-xl font-bold text-white tracking-tight">Pre-Asset</h2>
                        <span className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                            {PRE_ASSET_REFERRALS.length} Leads
                        </span>
                    </div>

                    {/* Pre-Asset List */}
                    <div className="space-y-4">
                        {PRE_ASSET_REFERRALS.map((referral, index) => (
                            <motion.div
                                key={referral.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] p-6 overflow-hidden transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-white group-hover:text-amber-200 transition-colors">{referral.name}</h3>
                                        {/* Status Pill */}
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                            <Clock size={12} className="text-emerald-400" />
                                            <span className="text-xs font-bold text-emerald-300">{referral.status}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-white/40 tracking-wide uppercase">{referral.details}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* SECTION 2: ASSET */}
                <div>
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-4 pl-4 border-l-4 border-emerald-500">
                        <h2 className="text-xl font-bold text-white tracking-tight">Asset</h2>
                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                            0 Assets
                        </span>
                    </div>

                    {/* Asset Empty State */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/5 border-dashed rounded-[32px] p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 size={32} className="text-white/20" />
                        </div>
                        <p className="text-white/40 font-medium text-lg">No asset referrals yet.</p>
                        <p className="text-white/20 text-sm mt-1">Keep going!</p>
                    </div>
                </div>

            </div>
        </div>
    )
}
