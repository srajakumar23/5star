'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Share2, UserPlus, ChevronRight, Clock, Star, TrendingUp, Wallet, Copy, Check, CheckCircle, Award, ChevronDown, User } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import { toast } from 'sonner'
import { useState } from 'react'

import { PageAnimate, PageItem } from '@/components/PageAnimate'
import { CircularProgress } from '@/components/ui/CircularProgress'
import { GlassCard } from '@/components/ui/GlassCard'

interface ActionHomeBlueUnifiedProps {
    user: {
        fullName: string
        role: string
        confirmedReferralCount: number
        yearFeeBenefitPercent: number
        potentialFeeBenefitPercent?: number
        benefitStatus: string
        empId?: string | null
        assignedCampus?: string | null
        referralCode: string
        studentFee?: number
    }
    recentReferrals: any[]
    whatsappUrl: string
    monthStats?: any | null
    totalLeadsCount?: number
    overrideEarnedAmount?: number
    overrideEstimatedAmount?: number
}

// Animation Variants
const buttonVariants: Variants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
}

const tiers = [
    { count: 1, percent: 5 },
    { count: 2, percent: 10 },
    { count: 3, percent: 25 },
    { count: 4, percent: 30 },
    { count: 5, percent: 50 },
]

function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Happy Morning'
    if (hour < 17) return 'Happy Afternoon'
    if (hour < 21) return 'Happy Evening'
    return 'Happy Night'
}

export function ActionHomeBlueUnified({ user, recentReferrals, whatsappUrl, monthStats, totalLeadsCount = 0, overrideEarnedAmount, overrideEstimatedAmount }: ActionHomeBlueUnifiedProps) {
    const firstName = user.fullName.split(' ')[0]
    const greeting = getGreeting()
    const [longTermExpanded, setLongTermExpanded] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(`${window.location.origin}/r/${user.referralCode}`)
        setCopied(true)
        toast.success('Referral link copied!')
        setTimeout(() => setCopied(false), 2000)
    }

    // Dynamic Data
    const displayCount = user.confirmedReferralCount
    const benefitPercent = user.yearFeeBenefitPercent || 0
    const potentialBenefitPercent = user.potentialFeeBenefitPercent || 0
    // If user.studentFee is present (from props via page.tsx), use it. But overrides take precedence for Benefit Logic.
    const totalFee = user.studentFee || 60000

    // Labels based on role (or if overrides are used, assume Commission/Earnings style?)
    const isParent = user.role === 'Parent'
    const benefitLabel = isParent ? 'Fee Benefit' : 'Earnings'

    // Calculate Amounts (Override Logic Added)
    const currentBenefitAmount = overrideEarnedAmount !== undefined
        ? overrideEarnedAmount
        : (totalFee * benefitPercent) / 100

    const potentialBenefitAmount = overrideEstimatedAmount !== undefined
        ? overrideEstimatedAmount
        : (totalFee * potentialBenefitPercent) / 100


    return (
        <PageAnimate className="space-y-4 md:space-y-6 pb-24 md:pb-12">
            {/* HERO SECTION - Royal Glass Theme */}
            <PageItem>
                <div className="flex flex-col md:flex-row gap-4 md:items-stretch h-auto md:h-64">
                    {/* Greeting Card */}
                    <GlassCard className="flex-1 relative overflow-hidden !bg-blue-600/20 !border-blue-400/30">
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-blue-100 mb-2">
                                    <Star size={12} className="text-amber-400 fill-amber-400 animate-pulse" />
                                    <span>Achariya Partnership Program (APP)</span>
                                </div>
                                <div className="mb-4">
                                    <span className="text-[11px] font-black text-amber-300 tracking-[0.2em] uppercase drop-shadow-md bg-white/5 px-3 py-1 rounded-full border border-amber-500/20">
                                        25<sup className="text-[0.6em]">th</sup> Year Celebration
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                                    {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">{firstName}</span>
                                </h1>
                                <p className="text-blue-200/80 font-medium">Here's your impact overview.</p>
                            </div>

                            <div className="mt-6 flex items-center gap-4">
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-wider text-blue-300 font-bold mb-1">Status</p>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Active
                                    </div>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-wider text-blue-300 font-bold mb-1">Campus</p>
                                    <p className="text-white font-bold text-sm">{user.assignedCampus || 'Global'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />
                    </GlassCard>

                    {/* Referrals Usage Card */}
                    <GlassCard className="w-full md:w-64 !bg-slate-900/40 !border-slate-700/50">
                        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Referrals Check</h3>
                            <div className="relative">
                                {/* Using Circular Progress Component */}
                                <CircularProgress
                                    value={displayCount}
                                    max={5}
                                    size={120}
                                    strokeWidth={8}
                                    color="text-amber-400"
                                    trackColor="text-slate-700/50"
                                >
                                    <div className="text-center">
                                        <div className="text-4xl font-black text-white leading-none mb-1">{displayCount}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Confirmed</div>
                                    </div>
                                </CircularProgress>
                            </div>
                            <div className="mt-4">
                                {displayCount >= 5 ? (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring" }}
                                        className="space-y-1"
                                    >
                                        <div className="text-amber-300 font-black text-xs uppercase tracking-wider animate-pulse">
                                            Outstanding Achievement!
                                        </div>
                                        <div className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-black px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(251,191,36,0.5)] inline-flex items-center gap-1.5 scale-105 transform">
                                            <Star size={12} fill="black" className="animate-spin-slow" />
                                            5-Star Member
                                            <Star size={12} fill="black" className="animate-spin-slow" />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="text-xs font-medium text-slate-300">
                                        <span className="text-amber-400 font-bold">{5 - displayCount}</span> more to reach 5-Star
                                    </div>
                                )}
                            </div>
                        </div>
                    </GlassCard>

                    {/* Fee Benefit Card */}
                    <GlassCard className="h-full !bg-indigo-950/30 !border-indigo-500/20 group-hover:!border-indigo-500/40 transition-colors">
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center backdrop-blur-md border border-amber-500/30">
                                    <Wallet size={16} className="text-amber-400" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-amber-200">
                                    {benefitLabel}
                                </span>
                            </div>

                            <div className="mt-auto">
                                {/* EARNED AMOUNT (Confirmed) */}
                                <div className="mb-3">
                                    <div className="text-[9px] font-bold uppercase tracking-wider text-amber-400/60 mb-0.5">
                                        Earned
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <div className="text-3xl md:text-4xl font-black tracking-tight text-white leading-none">
                                            ₹{currentBenefitAmount.toLocaleString('en-IN')}
                                        </div>
                                        <div className="text-sm font-bold text-amber-400">({benefitPercent}%)</div>
                                    </div>
                                </div>

                                {/* ESTIMATED AMOUNT (Potential) */}
                                <div className="pt-2 border-t border-white/5">
                                    <div className="text-[9px] font-bold uppercase tracking-wider text-indigo-300/60 mb-0.5">
                                        Estimated (Total)
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <div className="flex items-baseline gap-2">
                                            <div className="text-xl font-bold text-indigo-200 leading-none">
                                                ₹{potentialBenefitAmount.toLocaleString('en-IN')}
                                            </div>
                                            <div className="text-xs font-medium text-indigo-300/50">({potentialBenefitPercent}%)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative Background Icon */}
                        <Wallet className="absolute -bottom-6 -right-6 text-amber-500/5 rotate-[-15deg]" size={120} />
                    </GlassCard>
                </div>

                <div className="flex items-center gap-3 mt-4">
                    <motion.a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        className="flex-1 group relative flex items-center justify-center gap-3 bg-white/10 backdrop-blur-xl text-white h-14 rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] shadow-lg border border-white/20 hover:bg-white/20 transition-all overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <Share2 size={16} className="relative z-10" />
                        <span className="relative z-10">Share on WhatsApp</span>
                    </motion.a>

                    <button
                        onClick={handleCopy}
                        className="h-14 w-14 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border border-white/20 rounded-[20px] flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-lg relative group"
                    >
                        {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
                        {/* Tooltip */}
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Copy Link</span>
                    </button>
                </div>
            </PageItem>

            {/* PRIMARY CTA - Prominent Refer Button - Glass Theme */}
            <PageItem className="relative z-10">
                <Link href="/refer">
                    <motion.div
                        variants={buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 flex items-center justify-between shadow-2xl hover:bg-white/10 transition-all relative overflow-hidden cursor-pointer"
                    >
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-500/30 transition-colors opacity-50" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                                <UserPlus size={32} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-1 text-white">Refer a Family Now</h3>
                                <p className="text-blue-200/80 text-sm font-medium">Start earning benefits today</p>
                            </div>
                        </div>
                        <ChevronRight size={32} className="text-white/50 group-hover:text-white transition-colors relative z-10" />
                    </motion.div>
                </Link>
            </PageItem>

            {/* BENEFIT STRUCTURE - Royal Glass Theme (Blue-Slate Variant) */}
            <PageItem className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 backdrop-blur-xl rounded-[32px] md:rounded-[40px] p-6 md:p-8 border border-blue-500/30 shadow-2xl relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-sm" />
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight">How Your Benefits Work</h2>
                        <p className="text-sm text-blue-200/60 font-medium mt-0.5">Fee Reduction Tiers</p>
                    </div>
                </div>

                {/* Short Term Tiers */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle size={14} className="text-blue-400" />
                        <span className="text-xs font-semibold text-blue-200/80 uppercase tracking-wider">Short Term (Current Year)</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2 md:gap-3">
                        {tiers.map((tier, index) => {
                            const isCurrentTier = displayCount === tier.count
                            const isAchieved = displayCount >= tier.count

                            // Colorful gradients for each tier
                            const tierColors = [
                                'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-200',      // 1 REF
                                'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-200',  // 2 REFS
                                'from-teal-500/20 to-cyan-600/20 border-teal-500/30 text-teal-200',      // 3 REFS
                                'from-emerald-500/20 to-green-600/20 border-emerald-500/30 text-emerald-200',  // 4 REFS
                                'from-amber-400 to-yellow-500 text-black font-bold'    // 5 REFS - Gold (Solid)
                            ]

                            const getCardClasses = () => {
                                // Default Glass Style
                                let baseStyle = `bg-gradient-to-br ${tierColors[index]} border backdrop-blur-sm`

                                if (index === 4) {
                                    // 5th Tier is SOLID GOLD
                                    baseStyle = `bg-gradient-to-br from-amber-300 to-amber-500 border-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.4)]`
                                }

                                if (isCurrentTier) {
                                    return `${baseStyle} scale-105 z-10 shadow-xl ring-2 ring-white/50 bg-opacity-100`
                                }
                                if (isAchieved) {
                                    return `${baseStyle} opacity-100`
                                }
                                // Not achieved
                                return `${baseStyle} opacity-40 grayscale-[0.5]`
                            }

                            return (
                                <div key={tier.count} className={`relative py-4 md:py-5 px-2 rounded-xl text-center transition-all duration-300 ${getCardClasses()}`}>
                                    <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 md:mb-2 ${index === 4 ? 'text-black/70' : 'text-white/70'}`}>
                                        {tier.count} Ref{tier.count > 1 ? 's' : ''}
                                    </div>
                                    <div className={`text-xl md:text-3xl font-black tracking-tight ${index === 4 ? 'text-black' : 'text-white'}`}>
                                        {tier.percent}%
                                    </div>
                                    {isCurrentTier && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse shadow-glow" />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Long Term Benefits - Collapsible */}
                <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
                    <button
                        onClick={() => setLongTermExpanded(!longTermExpanded)}
                        className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <Star size={16} className="text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
                            <div className="text-left">
                                <h3 className="text-lg font-semibold text-white">Long Term Benefits</h3>
                                <p className="text-xs text-blue-200/60 font-medium">From 2nd Year Onwards</p>
                            </div>
                        </div>
                        <ChevronDown size={20} className={`text-white/40 transition-transform ${longTermExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {longTermExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-5 pb-5"
                        >
                            <div className="flex items-center justify-center gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star
                                        key={i}
                                        size={26}
                                        className={`${i <= displayCount
                                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                                            : 'text-white/10'
                                            } transition-all`}
                                        strokeWidth={i <= displayCount ? 0 : 2}
                                    />
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-blue-600/10 rounded-lg p-4 border border-blue-500/20">
                                    <p className="text-[10px] font-bold text-blue-300 uppercase tracking-wider mb-2">Base Benefit</p>
                                    <p className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight">15%</p>
                                    <p className="text-[10px] text-blue-200/50 font-medium">3% × 5 referrals</p>
                                </div>
                                <div className="bg-emerald-600/10 rounded-lg p-4 border border-emerald-500/20">
                                    <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-2">Per Referral</p>
                                    <p className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight">+5%</p>
                                    <p className="text-[10px] text-emerald-200/50 font-medium">Short term extra</p>
                                </div>
                            </div>

                            <p className="text-[10px] text-white/30 mt-4 text-center font-medium">
                                * Requires minimum 1 referral in the new year to unlock
                            </p>
                        </motion.div>
                    )}
                </div>
            </PageItem>

            {/* PERFORMANCE OVERVIEW - Royal Glass Theme (Purple-Pink Variant) */}
            {
                monthStats && (
                    <PageItem className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-[32px] md:rounded-[40px] p-6 md:p-8 border border-purple-500/30 shadow-2xl relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-purple-600 rounded-sm" />
                            <div>
                                <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight">Performance Overview</h2>
                                <p className="text-sm text-purple-200/60 font-medium mt-0.5">All Time Activity</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Leads Stat - ALL TIME */}
                            <div className="p-4 rounded-[24px] bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-purple-200">Pending Leads</span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-black text-white">{totalLeadsCount || 0}</span>
                                    <span className="text-xs font-medium text-white/40 mb-1">
                                        In Review
                                    </span>
                                </div>
                            </div>

                            {/* Confirmed Stat - ALL TIME (Using displayCount which is now Real Time Total) */}
                            <div className="p-4 rounded-[24px] bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-pink-200">Confirmed</span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-black text-white">{displayCount}</span>
                                    <span className="text-xs font-medium text-white/40 mb-1">
                                        Approved
                                    </span>
                                </div>
                            </div>
                        </div>
                    </PageItem>
                )
            }

            {/* RECENT REFERRALS - Royal Glass Theme (Cyan-Blue Variant) */}
            <PageItem className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-xl border border-cyan-500/30 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl relative z-10 min-h-[300px]">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h3 className="font-bold text-lg text-white tracking-tight">Recent Referrals</h3>
                    <div className="flex gap-2">
                        <Link href="/referrals" className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1 hover:bg-white/5 px-3 py-1.5 rounded-full transition-colors">
                            View All <ChevronRight size={14} />
                        </Link>
                    </div>
                </div>

                {recentReferrals.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 animate-pulse-slow">
                            <UserPlus size={24} className="text-white/40" />
                        </div>
                        <p className="text-white font-bold mb-1">No referrals yet</p>
                        <p className="text-blue-200/50 text-sm mb-6">Start sharing your code to earn benefits!</p>
                        <Link
                            href="/refer"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-600 text-black px-6 py-3 rounded-full font-bold text-sm transition-all shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:scale-105"
                        >
                            <UserPlus size={18} />
                            Make First Referral
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {recentReferrals.map((referral) => (
                            <div key={referral.id} className="p-5 hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg border border-white/10 uppercase">
                                        {(referral.studentName || referral.parentName).charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-white truncate group-hover:text-amber-300 transition-colors uppercase tracking-tight">
                                            {referral.studentName || referral.parentName}
                                        </p>
                                        <p className="text-[10px] text-blue-200/40 flex items-center gap-1 font-bold uppercase tracking-wider mt-0.5">
                                            <User size={10} className="text-blue-400" /> {referral.parentName}
                                        </p>
                                        <p className="text-[9px] text-blue-200/30 flex items-center gap-1 mt-1 font-medium">
                                            <Clock size={10} />
                                            {new Date(referral.createdAt).toLocaleDateString('en-GB')}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${referral.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}`}>
                                        {referral.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </PageItem>
        </PageAnimate>
    )
}
