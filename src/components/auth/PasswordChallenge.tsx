'use client'

import { useState } from 'react'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'

interface PasswordChallengeProps {
    mobile: string
    onLogin: (password: string) => void
    onBack: () => void
    onForgotPassword: () => void
    loading: boolean
}

export const PasswordChallenge = ({ mobile, onLogin, onBack, onForgotPassword, loading }: PasswordChallengeProps) => {
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2 relative">
                <button
                    onClick={onBack}
                    className="absolute top-0 left-0 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/30 text-white transition-all z-50 bg-white/20 border border-white/50 shadow-xl backdrop-blur-md group"
                >
                    <ArrowLeft className="text-white group-hover:-translate-x-0.5 transition-transform" size={20} strokeWidth={2.5} />
                </button>
                <div className="flex flex-col items-center mb-2 w-full">
                    <img
                        src="/achariya_25_logo.jpg"
                        alt="Achariya 25th Year"
                        className="h-16 w-auto mb-3 shadow-2xl relative z-10"
                    />
                    <p className="w-full text-blue-200 text-[10px] font-bold uppercase text-center leading-tight tracking-[0.2em] whitespace-nowrap">
                        Achariya Partnership Program (APP)
                    </p>
                    <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 drop-shadow-md">
                        25<sup className="text-[0.6em]">th</sup> Year Celebration
                    </p>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight drop-shadow-md">Welcome Back</h2>
                <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                    <p className="text-blue-200 text-xs font-mono tracking-widest">+91 {mobile}</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-blue-200/70 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Password</label>
                    <div className="relative group">
                        <input
                            type={showPassword ? "text" : "password"}
                            autoFocus
                            autoComplete="current-password"
                            disabled={loading}
                            className="block w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-12 h-12 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent shadow-lg transition-all text-lg font-medium tracking-wide"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && password && onLogin(password)}
                        />
                        <button
                            type="button"
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-amber-400 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        className={`w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white font-bold tracking-[0.05em] text-sm shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative overflow-hidden group border border-white/10 ${!password || loading ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                        onClick={() => onLogin(password)}
                        disabled={loading || !password}
                    >
                        <span className="relative z-10 flex items-center gap-2 transition-colors">
                            {loading ? 'Verifying...' : 'Login'}
                        </span>
                    </button>

                    <button
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300 hover:text-white transition-colors py-2"
                        onClick={onForgotPassword}
                        disabled={loading}
                    >
                        Forgot Password?
                    </button>
                </div>
            </div>
        </div>
    )
}
