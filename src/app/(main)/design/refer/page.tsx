'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Smartphone, ChevronRight, Lock, User, Users, School, GraduationCap, Star, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageAnimate, PageItem } from '@/components/PageAnimate'

export default function ReferDesignPage() {
    const [step, setStep] = useState(1)
    const [mobile, setMobile] = useState('')

    // Simulation Toggle
    const [flowType, setFlowType] = useState<'DIRECT' | 'LINK'>('LINK')

    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-[family-name:var(--font-outfit)] flex flex-col relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 z-20">
                <Link href="/design/blue-teal" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <ChevronLeft size={20} className="text-white/80" />
                </Link>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-1">
                        {flowType === 'LINK' ? 'Public Referral Link' : 'Internal Action'}
                    </span>
                    <h1 className="text-lg font-bold tracking-tight">Make a Referral</h1>
                </div>
                <div className="w-10" />
            </header>

            {/* Simulation Controls (Dev Only) */}
            <div className="flex justify-center mb-6 z-30 relative">
                <div className="bg-black/30 backdrop-blur-md rounded-full p-1 border border-white/10 flex gap-1">
                    <button
                        onClick={() => { setFlowType('DIRECT'); setStep(1); }}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${flowType === 'DIRECT' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                        Direct Flow
                    </button>
                    <button
                        onClick={() => { setFlowType('LINK'); setStep(1); }}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${flowType === 'LINK' ? 'bg-amber-400 text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                        Link Flow
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-lg mx-auto">

                <PageAnimate className="w-full">
                    {/* Ambassador Banner - ONLY in Link Flow */}
                    <AnimatePresence>
                        {flowType === 'LINK' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 p-4 text-center shadow-[0_0_30px_-10px_rgba(245,158,11,0.2)]"
                            >
                                {/* Glow Effect */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/20 rounded-full blur-[40px] pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-20 h-20 bg-amber-500/10 rounded-full blur-[40px] pointer-events-none"></div>

                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/20 mb-2">
                                        <Star size={10} className="text-amber-400 fill-amber-400" />
                                        <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest">You are referred by</span>
                                    </div>
                                    <h3 className="text-xl font-black text-white tracking-tight drop-shadow-sm">Rajakumaran</h3>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Glass Card */}
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-[32px] p-8 overflow-hidden shadow-2xl">

                        {/* Gold Glow Top */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50 shadow-[0_0_20px_rgba(251,191,36,0.5)]"></div>

                        {/* Steps Indicator */}
                        <div className="flex flex-col items-center mb-10">
                            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 mb-4 drop-shadow-sm">
                                {step}<span className="text-lg text-white/20 font-medium">/3</span>
                            </h2>
                            <div className="flex gap-2">
                                <div className={`h-1.5 w-8 rounded-full transition-all ${step >= 1 ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]' : 'bg-white/10'}`} />
                                <div className={`h-1.5 w-8 rounded-full transition-all ${step >= 2 ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]' : 'bg-white/10'}`} />
                                <div className={`h-1.5 w-8 rounded-full transition-all ${step >= 3 ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]' : 'bg-white/10'}`} />
                            </div>
                        </div>

                        {/* Step Content */}
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/60 uppercase tracking-widest pl-1">Parent Mobile Number</label>
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-pink-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                                            <div className="relative flex items-center bg-black/20 border border-white/10 rounded-2xl h-16 px-4 transition-all group-focus-within:border-pink-500/50 group-focus-within:bg-black/40">
                                                <Smartphone className="text-white/40 group-focus-within:text-pink-400 transition-colors mr-3" />
                                                <input
                                                    type="tel"
                                                    value={mobile}
                                                    onChange={(e) => setMobile(e.target.value)}
                                                    placeholder="+91 00000 00000"
                                                    className="w-full h-full bg-transparent border-none outline-none text-xl font-bold text-white placeholder-white/20"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setStep(2)}
                                        className="w-full h-16 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 text-black font-black text-sm uppercase tracking-widest shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Get OTP
                                        <ChevronRight size={18} strokeWidth={3} />
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-2">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-4">
                                            <Lock size={20} className="text-amber-400" />
                                        </div>

                                        {flowType === 'DIRECT' ? (
                                            <>
                                                {/* DIRECT FLOW MESSAGE */}
                                                <p className="text-sm text-white/60">Enter the 6-digit code sent to</p>
                                                <p className="text-lg font-bold text-white mt-1">+91 {mobile || '98765 43210'}</p>
                                            </>
                                        ) : (
                                            <>
                                                {/* LINK FLOW MESSAGE */}
                                                <p className="text-sm text-amber-200/80 font-medium mb-1 uppercase tracking-wide">Security Check</p>
                                                <p className="text-sm text-white/60 px-4 leading-relaxed">
                                                    For verification, the code has been sent to the referrer:
                                                </p>
                                                <div className="my-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10 inline-block">
                                                    <span className="font-bold text-white">Rajakumaran</span>
                                                </div>
                                                <p className="text-xs text-white/40">Please contact them to get the code.</p>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex gap-2 justify-center">
                                        {[1, 2, 3, 4, 5, 6].map((i) => (
                                            <div key={i} className="w-10 h-14 rounded-xl bg-black/20 border border-white/10 flex items-center justify-center text-xl font-bold">
                                                {i === 1 ? <span className="animate-pulse">|</span> : ''}
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setStep(3)}
                                        className="w-full h-16 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 text-black font-black text-sm uppercase tracking-widest shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Verify & Proceed
                                        <ChevronRight size={18} strokeWidth={3} />
                                    </button>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <InputGroup icon={<User />} label="Parent Name" placeholder="Dr. John Doe" />
                                    <InputGroup icon={<Users />} label="Student Name" placeholder="Master Alex" />
                                    <InputGroup icon={<School />} label="Campus" placeholder="Select Campus" />
                                    <InputGroup icon={<GraduationCap />} label="Grade" placeholder="Select Grade" />

                                    <button
                                        className="w-full h-16 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all mt-2"
                                    >
                                        Submit Referral
                                        <ShieldCheck size={18} strokeWidth={2.5} />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>

                    {/* Trust Footer */}
                    <div className="mt-8 flex flex-col items-center gap-3 opacity-50">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                            <ShieldCheck size={14} />
                            <span>100% Secure & Encrypted</span>
                        </div>
                        <p className="text-[10px] text-center max-w-xs leading-relaxed">
                            Your referral data is processed securely. Benefits are credited upon successful admission.
                        </p>
                    </div>
                </PageAnimate>
            </div>
        </div>
    )
}

function InputGroup({ icon, label, placeholder }: { icon: any, label: string, placeholder: string }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">{label}</label>
            <div className="relative group">
                <div className="absolute inset-0 bg-pink-500/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center bg-black/20 border border-white/10 rounded-xl h-12 px-4 transition-all group-focus-within:border-pink-500/50 group-focus-within:bg-black/40">
                    <div className="text-white/40 group-focus-within:text-pink-400 transition-colors mr-3 [&>svg]:w-5 [&>svg]:h-5">
                        {icon}
                    </div>
                    <input
                        className="w-full h-full bg-transparent border-none outline-none text-sm font-medium text-white placeholder-white/20"
                        placeholder={placeholder}
                    />
                </div>
            </div>
        </div>
    )
}
