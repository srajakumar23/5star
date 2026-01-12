'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Star, Award, Users } from 'lucide-react'


interface MobileWelcomeProps {
    onGetStarted: () => void
}

export function MobileWelcome({ onGetStarted }: MobileWelcomeProps) {
    return (
        <div className="flex flex-col h-full relative overflow-hidden">
            {/* Background Effects - Matches BrandSidebar but simplified for mobile */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

            <div className="flex-1 flex flex-col px-6 pt-12 pb-6 z-10 items-center text-center">
                {/* Logo & Badge Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center space-y-6 mb-8 w-full"
                >
                    <img
                        src="/achariya_25_logo.jpg"
                        alt="Achariya 25th Year"
                        className="w-24 h-auto rounded-xl shadow-2xl border border-white/10"
                    />

                    <div className="space-y-3 flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                            <Star size={10} className="text-amber-400 fill-amber-400 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">
                                Achariya Partnership Program (APP)
                            </span>
                        </div>
                        <div className="block">
                            <span className="text-[11px] font-black text-amber-400 tracking-[0.2em] uppercase drop-shadow-md">
                                25<sup className="text-[0.6em]">th</sup> Year Celebration
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Main Typography */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-8"
                >
                    <h1 className="text-6xl font-black tracking-tighter leading-[0.9]">
                        <span className="text-pink-500">25</span> <span className="text-amber-400">Years of</span>
                        <br />
                        <span className="text-white drop-shadow-2xl">Excellence</span>
                    </h1>

                    <p className="mt-6 text-blue-100/70 text-sm font-medium leading-relaxed max-w-[90%] mx-auto">
                        Join the elite community of ambassadors shaping the next generation of education. Secure, fast, and prestigious.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-2 gap-3 mt-auto mb-8"
                >
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col justify-center">
                        <span className="text-[10px] uppercase tracking-wider text-blue-200/60 font-semibold mb-1">Total Rewards</span>
                        <span className="text-2xl font-black text-white">₹1.2 Cr+</span>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col justify-center">
                        <span className="text-[10px] uppercase tracking-wider text-blue-200/60 font-semibold mb-1">Active Ambassadors</span>
                        <span className="text-2xl font-black text-white">2,400+</span>
                    </div>
                </motion.div>

                {/* Main Action */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                >
                    <button
                        onClick={onGetStarted}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-lg h-14 rounded-xl shadow-xl shadow-amber-500/20 border-t border-white/20 flex items-center justify-center transition-transform active:scale-95"
                    >
                        Get Started <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        </div>
    )
}
