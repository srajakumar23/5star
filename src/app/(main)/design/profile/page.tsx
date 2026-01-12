'use client'

import Link from 'next/link'
import { ChevronLeft, Camera, User, CreditCard, Shield, Settings, LogOut, ChevronRight, HelpCircle, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageAnimate, PageItem } from '@/components/PageAnimate'

export default function ProfileDesignPage() {
    const referralCount = 12 // Mock data for design preview
    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-[family-name:var(--font-outfit)] pb-24">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col">

                {/* Header */}
                <header className="px-6 pt-12 pb-2 flex items-center justify-between sticky top-0 z-20">
                    <Link href="/design/blue-teal" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <ChevronLeft size={20} className="text-white/80" />
                    </Link>
                    <h1 className="text-lg font-bold tracking-tight">My Profile</h1>
                    <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <Settings size={20} className="text-white/80" />
                    </button>
                </header>

                {/* Profile Hero Section */}
                <div className="flex flex-col items-center pt-8 pb-10 px-6">
                    {/* Avatar with Gold Ring */}
                    <div className="relative mb-6">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-amber-300 to-amber-600 rounded-full blur opacity-70 animate-pulse"></div>
                        <div className="relative w-28 h-28 rounded-full border-4 border-[#0f172a] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden shadow-2xl">
                            {/* The original instruction was malformed, assuming the intent was to replace the placeholder with a dynamic image */}
                            {/* If referralCount is 5 or more, show 'Prestigious Partner' image, otherwise 'Ambassador' image */}
                            <img
                                src={`/avatars/${referralCount >= 5 ? 'prestigious-partner' : 'ambassador'}.jpg`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center border-4 border-[#0f172a] shadow-lg">
                            <Camera size={14} />
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold mb-1">Dr. Anya Sharma</h2>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Prestigious Partner</span>
                    </div>

                    {/* Stats Row */}
                    <div className="w-full grid grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center backdrop-blur-sm">
                            <span className="text-2xl font-bold text-white mb-0.5">12</span>
                            <span className="text-xs text-white/50 uppercase tracking-wider font-medium">Total Referrals</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none" />
                            <span className="text-2xl font-bold text-amber-400 mb-0.5">₹65k</span>
                            <span className="text-xs text-amber-200/50 uppercase tracking-wider font-medium">Total Earned</span>
                        </div>
                    </div>
                </div>

                {/* Menu List */}
                <div className="px-6 flex-1 space-y-3">
                    <MenuLink
                        icon={<User size={18} className="text-blue-400" />}
                        label="Personal Details"
                        subLabel="Name, Phone, Email"
                    />
                    <MenuLink
                        icon={<CreditCard size={18} className="text-emerald-400" />}
                        label="Bank Account"
                        subLabel="For receiving payouts"
                    />
                    <MenuLink
                        icon={<Shield size={18} className="text-purple-400" />}
                        label="Security"
                        subLabel="Password, Biometrics"
                    />
                    <MenuLink
                        icon={<HelpCircle size={18} className="text-pink-400" />}
                        label="Help & Support"
                        subLabel="FAQs, Contact Us"
                    />
                </div>

                {/* Logout Button */}
                <div className="px-6 pt-8 pb-4">
                    <button className="w-full h-14 rounded-2xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 flex items-center justify-center gap-2 font-bold transition-all active:scale-95">
                        <LogOut size={18} />
                        Sign Out
                    </button>
                    <p className="text-center text-[10px] text-white/20 mt-4 uppercase tracking-widest">
                        Version 2.5.0 • Build 2024
                    </p>
                </div>

            </div>
        </div>
    )
}

function MenuLink({ icon, label, subLabel }: { icon: React.ReactNode, label: string, subLabel: string }) {
    return (
        <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group active:scale-[0.98]">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div className="text-left">
                    <h3 className="font-bold text-white text-sm">{label}</h3>
                    <p className="text-xs text-white/40">{subLabel}</p>
                </div>
            </div>
            <ChevronRight size={18} className="text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all" />
        </button>
    )
}
