'use client'

import { useState, useEffect } from 'react'
import { X, Search, Calculator, User, ArrowRight, Loader2, Info, CheckCircle2 } from 'lucide-react'
import { calculatePendingSettlement, createSettlement } from '@/app/settlement-actions'
import { toast } from 'sonner'

interface UserRecord {
    userId: number
    fullName: string
    mobileNumber: string
    role: string
    confirmedReferralCount: number
}

interface SettlementCalculatorModalProps {
    isOpen: boolean
    onClose: () => void
    users: UserRecord[]
    onSuccess: () => void
}

export function SettlementCalculatorModal({ isOpen, onClose, users, onSuccess }: SettlementCalculatorModalProps) {
    const [search, setSearch] = useState('')
    const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null)
    const [calculation, setCalculation] = useState<{
        pending: number;
        totalEarned: number;
        totalSettled: number;
        benefitPercent: number;
    } | null>(null)
    const [loading, setLoading] = useState(false)
    const [isCreating, setIsCreating] = useState(false)

    // Filtered users (only those with referrals)
    const filteredUsers = users.filter(u =>
        (u.fullName.toLowerCase().includes(search.toLowerCase()) ||
            u.mobileNumber.includes(search)) &&
        u.confirmedReferralCount > 0
    ).slice(0, 5)

    useEffect(() => {
        if (selectedUser) {
            handleCalculate(selectedUser.userId)
        } else {
            setCalculation(null)
        }
    }, [selectedUser])

    const handleCalculate = async (userId: number) => {
        setLoading(true)
        try {
            const res = await calculatePendingSettlement(userId)
            if (res.success && res.pending !== undefined) {
                setCalculation({
                    pending: res.pending,
                    totalEarned: res.totalEarned || 0,
                    totalSettled: res.totalSettled || 0,
                    benefitPercent: res.benefitPercent || 0
                })
            } else {
                toast.error(res.error || 'Failed to calculate')
            }
        } catch (error) {
            toast.error('Calculation error')
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async () => {
        if (!selectedUser || !calculation) return

        if (calculation.pending <= 0) {
            toast.error('No pending balance to settle')
            return
        }

        setIsCreating(true)
        try {
            const res = await createSettlement(selectedUser.userId, calculation.pending)
            if (res.success) {
                toast.success(`Settlement of ₹${calculation.pending} created`)
                onSuccess()
                handleClose()
            } else {
                toast.error(res.error || 'Failed to create')
            }
        } catch (error) {
            toast.error('Unexpected error')
        } finally {
            setIsCreating(false)
        }
    }

    const handleClose = () => {
        setSearch('')
        setSelectedUser(null)
        setCalculation(null)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-gray-900 p-8 text-white relative flex-shrink-0">
                    <button
                        onClick={handleClose}
                        className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-2"
                    >
                        <X size={24} />
                    </button>
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-xl">
                        <Calculator size={32} className="text-violet-400" />
                    </div>
                    <h2 className="text-2xl font-black italic tracking-tight text-center uppercase">SETTLEMENT CALCULATOR</h2>
                    <p className="text-gray-400 text-[10px] font-black tracking-[0.2em] mt-2 text-center uppercase">Phase 3 Financial Management Layer</p>
                </div>

                <div className="p-8 space-y-8 overflow-y-auto">
                    {/* User Selection */}
                    {!selectedUser ? (
                        <div className="space-y-4">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search Ambassador (Name or Mobile)..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-gray-900 focus:outline-none font-bold text-sm transition-all shadow-inner bg-gray-50/30"
                                />
                            </div>

                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Top Matching Ambassadors</p>
                                {filteredUsers.length > 0 ? (
                                    <div className="space-y-2">
                                        {filteredUsers.map(user => (
                                            <button
                                                key={user.userId}
                                                onClick={() => setSelectedUser(user)}
                                                className="w-full p-4 flex items-center justify-between bg-white border border-gray-100 rounded-2xl hover:border-gray-900 hover:shadow-lg transition-all text-left group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all">
                                                        <User size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900">{user.fullName}</p>
                                                        <p className="text-xs text-gray-500">{user.mobileNumber} • <span className="text-violet-600 font-bold">{user.confirmedReferralCount} Referrals</span></p>
                                                    </div>
                                                </div>
                                                <ArrowRight size={18} className="text-gray-300 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                        <p className="text-sm font-bold text-gray-400 italic">No ambassadors with confirmed referrals found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Calculation Result */
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            {/* Selected Profile Header */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 uppercase tracking-tight">{selectedUser.fullName}</p>
                                        <p className="text-xs text-violet-600 font-black tracking-widest uppercase">{selectedUser.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest border-b border-dashed border-gray-300 transition-colors"
                                >
                                    Change User
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                    <Loader2 className="w-12 h-12 text-violet-500 animate-spin" />
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Running Settlement Algorithm...</p>
                                </div>
                            ) : calculation && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-white border border-gray-100 rounded-3xl space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Calculated Payout</p>
                                            <p className="text-2xl font-black text-gray-900">₹{calculation.totalEarned.toLocaleString()}</p>
                                            <div className="flex items-center gap-1 text-[10px] text-violet-600 font-bold uppercase">
                                                <Info size={10} /> {calculation.benefitPercent}% Slab
                                            </div>
                                        </div>
                                        <div className="p-5 bg-white border border-gray-100 rounded-3xl space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Settled</p>
                                            <p className="text-2xl font-black text-gray-500">₹{calculation.totalSettled.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-amber-50 rounded-[2.5rem] border-2 border-amber-100 flex flex-col items-center text-center space-y-2 shadow-xl shadow-amber-100/30">
                                        <p className="text-[11px] font-black text-amber-600 uppercase tracking-[0.2em]">Net Pending Balance</p>
                                        <p className="text-5xl font-black text-gray-900 italic tracking-tighter">₹{calculation.pending.toLocaleString()}</p>
                                        {calculation.pending > 0 && (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-200/50 rounded-full text-[10px] font-black text-amber-800 uppercase mt-4">
                                                <CheckCircle2 size={12} /> Eligible for Referral Payout
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <button
                                            onClick={handleCreate}
                                            disabled={isCreating || calculation.pending <= 0}
                                            className="w-full py-5 bg-gray-900 hover:bg-black text-white rounded-3xl font-black italic text-lg shadow-2xl shadow-gray-300 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                                        >
                                            {isCreating ? <Loader2 className="animate-spin" size={24} /> : (
                                                <div className="flex items-center justify-center gap-3">
                                                    INITIATE SETTLEMENT
                                                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
                                                </div>
                                            )}
                                        </button>
                                        <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                            This will create a <span className="text-amber-600">Pending</span> request in the settlement ledger.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
