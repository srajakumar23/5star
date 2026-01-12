'use client'

import { Star, Shield, Award } from 'lucide-react'
import { motion } from 'framer-motion'

export const BrandSidebar = () => {
    return (
        <div className="hidden lg:flex flex-col justify-between w-1/2 min-h-screen bg-[#0f172a] relative overflow-hidden p-12 text-white">
            {/* Ambient Background & Mesh Effects - Royal Theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-[#0f172a] to-blue-950 opacity-100 z-0"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 z-0"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 z-0"></div>

            {/* Brand Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
            >
                {/* Logo Container with Glow */}
                <div className="relative inline-block mb-8 group">
                    <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-700"></div>
                    <img
                        src="/achariya_25_logo.jpg"
                        alt="Achariya 25th Year"
                        className="h-24 w-auto shadow-2xl relative z-10"
                    />
                </div>
            </motion.div>

            {/* Central Value Prop (Cinematic) */}
            <div className="relative z-10 space-y-8 max-w-lg">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    <div className="inline-flex flex-col items-start gap-1 mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
                            <Star size={12} className="text-amber-400 fill-amber-400 animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-100">Achariya Partnership Program (APP)</span>
                        </div>
                        <span className="text-[10px] font-black text-amber-400 tracking-[0.2em] uppercase pl-2 drop-shadow-lg opacity-90">
                            25<sup className="text-[0.6em]">th</sup> Year Celebration
                        </span>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter leading-[1.1] mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-amber-300 to-amber-200">25 Years of</span> <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70">Excellence</span>
                    </h1>
                    <p className="text-lg text-blue-100/60 font-medium leading-relaxed max-w-md">
                        Join the elite community of ambassadors shaping the next generation of education. Secure, fast, and prestigious.
                    </p>
                </motion.div>

                {/* Live Stats Ticker (Simulated) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="grid grid-cols-2 gap-4"
                >
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Total Rewards</p>
                        <p className="text-2xl font-black text-white">₹1.2 Cr+</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Active Ambassadors</p>
                        <p className="text-2xl font-black text-white">2,400+</p>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="relative z-10 flex items-center justify-between text-white/30 text-xs font-medium uppercase tracking-widest"
            >
            </motion.div>
        </div>
    )
}
