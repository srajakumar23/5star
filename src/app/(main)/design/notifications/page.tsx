'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, CheckCheck, Wallet, Shield, Milestone, Bell, Info, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageAnimate, PageItem } from '@/components/PageAnimate'

// Mock Data
const NOTIFICATIONS = [
    {
        id: 1,
        type: 'CREDIT',
        title: 'Money Credited',
        message: 'Your referral bonus of ₹4,100 has been credited to your wallet.',
        time: 'Just now',
        unread: true,
        icon: Wallet,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10'
    },
    {
        id: 2,
        type: 'SECURITY',
        title: 'New Login Detected',
        message: 'A new login was detected from iPhone 14 Pro in Chennai.',
        time: '2 hours ago',
        unread: true,
        icon: Shield,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10'
    },
    {
        id: 3,
        type: 'UPDATE',
        title: 'System Update',
        message: 'The Ambassador Portal has been updated to v2.5.0 with new features.',
        time: '5 hours ago',
        unread: false,
        icon: Milestone,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10'
    },
    {
        id: 4,
        type: 'INFO',
        title: 'Referral Status Update',
        message: 'Your referral "Dr. Kumar" has completed the admission process.',
        time: '1 day ago',
        unread: false,
        icon: Info,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10'
    }
]

export default function NotificationsDesignPage() {
    const [notifications, setNotifications] = useState(NOTIFICATIONS)

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
    }

    const removeNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-[family-name:var(--font-outfit)] pb-20">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col">

                {/* Header */}
                <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 z-20 bg-[#0f172a]/80 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <Link href="/design/blue-teal" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                            <ChevronLeft size={20} className="text-white/80" />
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
                    </div>
                    <button
                        onClick={markAllRead}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider hover:bg-amber-500/20 transition-all"
                    >
                        <CheckCheck size={14} />
                        Mark all read
                    </button>
                </header>

                {/* List */}
                <div className="px-6 space-y-4 flex-1">
                    <AnimatePresence mode="popLayout">
                        {notifications.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-20 text-center opacity-50"
                            >
                                <Bell size={48} className="mb-4 text-white/20" />
                                <p className="text-sm font-medium">No new notifications</p>
                            </motion.div>
                        ) : (
                            notifications.map((n) => (
                                <motion.div
                                    key={n.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={`relative group overflow-hidden rounded-[24px] border transition-all ${n.unread
                                            ? 'bg-white/10 border-white/20 shadow-lg shadow-indigo-500/10'
                                            : 'bg-white/5 border-white/5 opacity-80'
                                        }`}
                                >
                                    <div className="p-5 flex gap-4">
                                        {/* Icon */}
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 ${n.bg} ${n.color}`}>
                                            <n.icon size={20} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`text-base font-bold truncate pr-6 ${n.unread ? 'text-white' : 'text-white/70'}`}>
                                                    {n.title}
                                                </h3>
                                                <span className="text-[10px] font-medium text-white/40 whitespace-nowrap">{n.time}</span>
                                            </div>
                                            <p className="text-sm text-white/60 leading-relaxed line-clamp-2">
                                                {n.message}
                                            </p>
                                        </div>

                                        {/* Unread Dot */}
                                        {n.unread && (
                                            <div className="absolute top-6 right-4 w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)] animate-pulse" />
                                        )}

                                        {/* Dismiss Button (Hover) */}
                                        <button
                                            onClick={() => removeNotification(n.id)}
                                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/40 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
