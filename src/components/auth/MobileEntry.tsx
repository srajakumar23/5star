'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { NativeLogin } from '@/components/NativeLogin'

interface MobileEntryProps {
    mobile: string
    setMobile: (value: string) => void
    onNext: () => void
    loading: boolean
}

export const MobileEntry = ({ mobile, setMobile, onNext, loading }: MobileEntryProps) => {
    return (
        <div className="space-y-4">
            <div className="text-center space-y-2">
                <img
                    src="/achariya_25_logo.jpg"
                    alt="Achariya 25th Year"
                    className="h-20 w-auto mx-auto mb-4 shadow-2xl"
                />

                {/* Brand Context - Subordinate to Logo and Title */}
                {/* Brand Context - Subordinate to Logo and Title */}
                <div className="flex flex-col items-center mb-6 w-full space-y-1">
                    <p className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.2em] leading-tight text-center">
                        Achariya Partnership Program
                    </p>
                    <p className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.2em] leading-tight text-center">
                        (APP)
                    </p>
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent my-2"></div>
                    <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.25em] drop-shadow-md">
                        25<sup className="text-[0.6em]">th</sup> Year Celebration
                    </p>
                </div>

                {/* Main Action Title - Dominant */}
                <h2 className="text-4xl font-black text-white tracking-tighter mb-2 drop-shadow-lg">Member Access</h2>
                <p className="text-blue-200/60 text-sm font-medium tracking-wide">Enter your mobile number to begin</p>
            </div>

            <div className="space-y-5">
                <div className="group relative">
                    <input
                        type="tel"
                        autoFocus
                        autoComplete="tel"
                        disabled={loading}
                        className={`relative z-10 block w-full bg-white/5 border border-white/10 rounded-2xl px-6 h-14 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent shadow-xl transition-all text-xl font-bold tracking-[0.2em] text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        placeholder="00000 00000"
                        value={mobile}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '')
                            if (value.length <= 10) setMobile(value)
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && mobile.length === 10 && onNext()}
                        maxLength={10}
                    />
                    {mobile.length > 0 && mobile.length < 10 && (
                        <p className="text-center text-[10px] text-amber-500 mt-2 font-bold uppercase tracking-wider animate-pulse">
                            {10 - mobile.length} digits remaining
                        </p>
                    )}
                </div>

                <button
                    className={`w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white font-bold tracking-[0.05em] text-sm shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-white/10 ${mobile.length !== 10 || loading ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    onClick={onNext}
                    disabled={loading || mobile.length !== 10}
                >
                    {loading ? 'Authenticating...' : 'Secure Access'}
                </button>
            </div>

            <div className="hidden sm:block mt-4"></div>
        </div>
    )
}
