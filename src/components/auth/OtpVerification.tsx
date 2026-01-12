'use client'

import { ChevronLeft } from 'lucide-react'

interface OtpVerificationProps {
    mobile: string
    otp: string
    setOtp: (value: string) => void
    onVerify: () => void
    onBack: () => void
    loading: boolean
    isNewUser: boolean
    isForgotMode?: boolean
}

export const OtpVerification = ({ mobile, otp, setOtp, onVerify, onBack, loading, isNewUser, isForgotMode }: OtpVerificationProps) => {
    return (
        <div className="space-y-6">
            <div className="text-center space-y-2 relative">
                <button
                    onClick={onBack}
                    className="absolute top-0 left-0 w-10 h-10 rounded-full flex items-center justify-center bg-white/15 border border-white/20 text-white hover:bg-white/25 transition-all z-50 group shadow-lg"
                >
                    <ChevronLeft className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2.5} />
                </button>
                <div className="flex flex-col items-center mb-2 w-full">
                    <img
                        src="/achariya_25_logo.jpg"
                        alt="Achariya 25th Year"
                        className="h-16 w-auto mb-3 shadow-2xl relative z-10"
                    />
                    <h2 className="text-white text-base font-black tracking-tight drop-shadow-lg uppercase leading-tight text-center">
                        Achariya
                    </h2>
                    <p className="text-[10px] text-blue-200/70 font-bold uppercase tracking-widest text-center">
                        Partnership Program
                    </p>
                    <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1.5 drop-shadow-md text-center">
                        25<sup className="text-[0.6em]">th</sup> Year Celebration
                    </p>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight drop-shadow-md">Verify Identity</h2>
                <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                    <p className="text-blue-200 text-xs font-mono tracking-widest">+91 {mobile}</p>
                </div>
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-[0.2em] mt-2">
                    {isForgotMode ? 'Password Recovery' : isNewUser ? 'New Registration' : 'Secure Login'}
                </p>
            </div>

            <div className="space-y-6">
                <div className="group relative">
                    <label className="text-blue-200/70 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block text-center">Enter 6-Digit Code</label>
                    <input
                        type="text"
                        autoFocus
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        disabled={loading}
                        className="block w-full bg-white/5 border border-white/10 rounded-2xl px-4 h-14 text-white placeholder-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent shadow-lg transition-all text-3xl font-black tracking-[0.5em] text-center"
                        placeholder="••••••"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => e.key === 'Enter' && otp.length === 6 && onVerify()}
                    />
                    <p className="text-blue-200/40 text-[10px] mt-4 tracking-widest uppercase text-center">Code sent via SMS</p>
                </div>

                <button
                    className={`w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white font-bold tracking-[0.05em] text-sm shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative overflow-hidden group border border-white/10 ${otp.length !== 6 || loading ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    onClick={onVerify}
                    disabled={loading || otp.length !== 6}
                >
                    <span className="relative z-10 flex items-center gap-2 transition-colors">
                        {loading ? 'Verifying...' : 'Verify & Proceed'}
                    </span>
                </button>
            </div>
        </div>
    )
}
