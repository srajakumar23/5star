'use client'

import { useState } from 'react'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'

interface ResetPasswordProps {
    onReset: (password: string, confirm: string) => void
    onCancel: () => void
    loading: boolean
}

export const ResetPassword = ({ onReset, onCancel, loading }: ResetPasswordProps) => {
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2 relative">
                <button
                    onClick={onCancel}
                    className="absolute top-0 left-0 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/30 text-white transition-all z-50 bg-white/20 border border-white/50 shadow-xl backdrop-blur-md group"
                >
                    <ArrowLeft className="text-white group-hover:-translate-x-0.5 transition-transform" size={20} strokeWidth={2.5} />
                </button>
                <div className="flex flex-col items-center mb-2 w-full">
                    <p className="w-full text-blue-200 text-[10px] font-bold uppercase text-center leading-tight tracking-[0.2em] whitespace-nowrap">
                        Achariya Partnership Program (APP)
                    </p>
                    <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 drop-shadow-md">
                        25<sup className="text-[0.6em]">th</sup> Year Celebration
                    </p>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight drop-shadow-md">Reset Password</h2>
                <div className="inline-block px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 backdrop-blur-sm">
                    <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-amber-400/20">New Credentials</p>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="text-blue-200/70 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">New Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="block w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-12 h-12 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent shadow-lg transition-all text-lg font-medium tracking-wide"
                            placeholder="Min 8 chars"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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

                <div>
                    <label className="text-blue-200/70 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Confirm Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        className="block w-full bg-white/5 border border-white/10 rounded-2xl pl-6 h-12 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent shadow-lg transition-all text-lg font-medium tracking-wide"
                        placeholder="Retype password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        className={`w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white font-bold tracking-[0.15em] text-sm shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative overflow-hidden group border border-white/10 ${loading ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                        onClick={() => onReset(newPassword, confirmNewPassword)}
                        disabled={loading}
                    >
                        <span className="relative z-10 flex items-center gap-2 transition-colors">
                            {loading ? 'Updating...' : 'Save New Password'}
                        </span>
                    </button>

                    <button
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300 hover:text-white transition-colors py-2"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
