'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Loader2, ArrowLeft, KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import { verifyTwoFactorAction } from './actions'

export default function Verify2FAPage() {
    const [code, setCode] = useState(['', '', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return
        const newCode = [...code]
        newCode[index] = value
        setCode(newCode)

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`)
            nextInput?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`)
            prevInput?.focus()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const otpCode = code.join('')
        if (otpCode.length < 6) {
            toast.error('Please enter the full 6-digit code')
            return
        }

        setLoading(true)
        try {
            const result = await verifyTwoFactorAction(otpCode)
            if (result.success) {
                toast.success('Identity verified successfully')
                router.push('/superadmin')
            } else {
                toast.error(result.error || 'Invalid verification code')
            }
        } catch (error) {
            toast.error('Verification failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 p-12 space-y-10">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto rotate-3">
                        <ShieldCheck size={40} className="text-red-600 -rotate-3" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Two-Step Verification</h1>
                    <p className="text-gray-400 font-medium text-sm leading-relaxed">
                        Enter the 6-digit code sent to your registered device to access the Super Admin portal.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex justify-between gap-2">
                        {code.map((digit, i) => (
                            <input
                                key={i}
                                id={`otp-${digit}-${i}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                className="w-12 h-16 text-center text-2xl font-black text-gray-900 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-red-500 transition-all outline-none"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-gray-900 text-white rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-black transition-all hover:shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <KeyRound size={20} />}
                        {loading ? 'Verifying...' : 'Verify & Continue'}
                    </button>
                </form>

                <div className="pt-2 text-center">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-red-600 transition-colors inline-flex items-center gap-2"
                    >
                        <ArrowLeft size={14} />
                        Back to Dashboard
                    </button>
                </div>

                <div className="pt-6 border-t border-gray-50 flex justify-center gap-4">
                    <div className="p-2 bg-emerald-50 rounded-full">
                        <ShieldCheck size={16} className="text-emerald-600" />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                        Secured by Achariya<br />Multi-Factor Protocol
                    </p>
                </div>
            </div>
        </div>
    )
}
