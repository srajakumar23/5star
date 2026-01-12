'use client'

import { useState } from 'react'
import { Star, ShieldCheck, User, GraduationCap, Eye, EyeOff, Shield } from 'lucide-react'
import { PrivacyModal } from '@/components/PrivacyModal'

interface RegistrationDetailsProps {
    formData: any
    setFormData: (data: any) => void
    campuses: any[]
    onNext: () => void
    loading: boolean
}

export const RegistrationDetails = ({ formData, setFormData, campuses, onNext, loading }: RegistrationDetailsProps) => {
    const [showRegisterPassword, setShowRegisterPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [showPrivacy, setShowPrivacy] = useState(false)
    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
    const [isValidPassword, setIsValidPassword] = useState(false)

    // Password validation logic
    const validatePassword = (pwd: string) => {
        const minLength = pwd.length >= 8
        const hasUpper = /[A-Z]/.test(pwd)
        const hasNumber = /[0-9]/.test(pwd)
        const hasSpecial = /[!@#$%^&*]/.test(pwd)
        return minLength && hasUpper && hasNumber && hasSpecial
    }

    // Email validation logic
    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const isFormValid = () => {
        if (!formData.fullName || !validateEmail(formData.email) || !validatePassword(formData.password) || formData.password !== formData.confirmPassword || !agreedToPrivacy) return false

        if (formData.role === 'Parent' && !formData.childEprNo) return false
        if (formData.role === 'Staff' && (!formData.empId || !formData.campusId)) return false
        if (formData.role === 'Alumni' && !formData.aadharNo) return false
        if (formData.role === 'Others' && !formData.aadharNo) return false

        return true
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <div className="flex flex-col items-center mb-2 w-full">
                    <h1 className="w-full text-rose-600 text-base font-black uppercase text-center leading-normal">
                        Achariya Partnership Program<br />(APP)
                    </h1>
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-200 to-transparent my-1"></div>
                    <p className="text-amber-700 text-[11px] font-serif italic tracking-widest">
                        25th Year Celebration
                    </p>
                </div>
                <h2 className="text-xl font-black text-neutral-900 tracking-tight">Elite Profile</h2>
                <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <p className="text-amber-600 text-[10px] font-black uppercase tracking-[0.2em]">{formData.role} Registration</p>
                </div>
            </div>

            <div className="space-y-4 h-[70vh] overflow-y-auto pr-2 custom-scrollbar scroll-smooth">
                {/* Role Selection */}
                <div>
                    <label className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Membership Level</label>
                    <div className="grid grid-cols-4 gap-2">
                        {['Parent', 'Staff', 'Alumni', 'Others'].map((role) => (
                            <div
                                key={role}
                                onClick={() => {
                                    const newRole = role as 'Parent' | 'Staff' | 'Alumni' | 'Others'
                                    const updatedGrade = newRole === 'Parent' ? 'Grade 1' : ''
                                    setFormData({ ...formData, role: newRole, grade: updatedGrade })
                                }}
                                className={`flex flex-col items-center justify-center gap-2 py-3 px-1 rounded-xl cursor-pointer transition-all border ${formData.role === role ? 'border-amber-400 bg-amber-50' : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100'}`}
                            >
                                {role === 'Parent' && <User size={16} className={formData.role === role ? 'text-amber-600' : 'text-neutral-400'} />}
                                {role === 'Staff' && <ShieldCheck size={16} className={formData.role === role ? 'text-amber-600' : 'text-neutral-400'} />}
                                {role === 'Alumni' && <GraduationCap size={16} className={formData.role === role ? 'text-amber-600' : 'text-neutral-400'} />}
                                {role === 'Others' && <Star size={16} className={formData.role === role ? 'text-amber-600' : 'text-neutral-400'} />}
                                <span className={`text-[9px] font-bold uppercase ${formData.role === role ? 'text-neutral-900' : 'text-neutral-500'}`}>{role}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Common Fields */}
                <div className="space-y-4">
                    {/* Password Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Create Password</label>
                            <div className="relative">
                                <input
                                    type={showRegisterPassword ? "text" : "password"}
                                    className={`w-full bg-amber-50/30 border border-amber-400 rounded-xl pl-4 pr-10 h-12 text-neutral-900 placeholder-amber-700/30 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-[0_4px_20px_rgba(251,191,36,0.1)] caret-rose-600 transition-all text-sm font-medium ${isValidPassword ? 'ring-emerald-500/50 focus:ring-emerald-500' : ''}`}
                                    value={formData.password}
                                    placeholder='Strong password'
                                    onChange={(e) => {
                                        setFormData({ ...formData, password: e.target.value })
                                        setIsValidPassword(validatePassword(e.target.value))
                                    }}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-amber-600 transition-colors"
                                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                >
                                    {showRegisterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {/* Password Strength Indicators */}
                            <div className="flex gap-1 mt-2 px-1">
                                <div className={`h-1 flex-1 rounded-full transition-colors ${formData.password.length >= 8 ? 'bg-emerald-500' : 'bg-neutral-200'}`}></div>
                                <div className={`h-1 flex-1 rounded-full transition-colors ${/[A-Z]/.test(formData.password) ? 'bg-emerald-500' : 'bg-neutral-200'}`}></div>
                                <div className={`h-1 flex-1 rounded-full transition-colors ${/[0-9]/.test(formData.password) ? 'bg-emerald-500' : 'bg-neutral-200'}`}></div>
                                <div className={`h-1 flex-1 rounded-full transition-colors ${/[!@#$%^&*]/.test(formData.password) ? 'bg-emerald-500' : 'bg-neutral-200'}`}></div>
                            </div>
                        </div>
                        <div>
                            <label className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Confirm</label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className={`w-full bg-amber-50/30 border border-amber-400 rounded-xl px-4 h-12 text-neutral-900 placeholder-amber-700/30 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-[0_4px_20px_rgba(251,191,36,0.1)] caret-rose-600 transition-all text-sm font-medium ${formData.confirmPassword && formData.password === formData.confirmPassword ? 'ring-emerald-500/50 focus:ring-emerald-500' : ''}`}
                                value={formData.confirmPassword}
                                placeholder='Retype password'
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Full Name</label>
                        <input
                            className="w-full bg-amber-50/30 border border-amber-400 rounded-xl px-4 h-12 text-neutral-900 placeholder-amber-700/30 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-[0_4px_20px_rgba(251,191,36,0.1)] caret-rose-600 transition-all text-sm font-medium"
                            value={formData.fullName}
                            placeholder="Your legal name"
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>

                    {/* Role Specifics */}
                    {formData.role === 'Parent' && (
                        <div className="space-y-4 animate-in slide-in-from-top-4 fade-in duration-300">
                            <div>
                                <label className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Child ERP No</label>
                                <input
                                    className="w-full bg-amber-50/30 border border-amber-400 rounded-xl px-4 h-12 text-neutral-900 placeholder-amber-700/30 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-[0_4px_20px_rgba(251,191,36,0.1)] caret-rose-600 transition-all text-sm font-medium"
                                    placeholder="Enter Child ERP Number"
                                    value={formData.childEprNo || ''}
                                    onChange={(e) => setFormData({ ...formData, childEprNo: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Campus</label>
                                <select
                                    className="w-full bg-amber-50/30 border border-amber-400 rounded-xl px-4 h-12 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-[0_4px_20px_rgba(251,191,36,0.1)] transition-all text-sm font-medium appearance-none cursor-pointer"
                                    value={formData.campusId}
                                    onChange={(e) => setFormData({ ...formData, campusId: e.target.value })}
                                >
                                    <option value="" className="text-neutral-400">Select Campus</option>
                                    {campuses.map(c => (
                                        <option key={c.id} value={c.id} className="text-black">{c.campusName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Other roles Logic (Staff, Alumni, Others) same pattern... */}
                    {formData.role === 'Staff' && (
                        <div className="space-y-4 animate-in slide-in-from-top-4 fade-in duration-300">
                            <div>
                                <label className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Employee ID</label>
                                <input
                                    className="w-full bg-amber-50/30 border border-amber-400 rounded-xl px-4 h-12 text-neutral-900 placeholder-amber-700/30 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-[0_4px_20px_rgba(251,191,36,0.1)] caret-rose-600 transition-all text-sm font-medium"
                                    placeholder="Enter Employee ID"
                                    value={formData.empId || ''}
                                    onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Working Campus</label>
                                <select
                                    className="w-full bg-amber-50/30 border border-amber-400 rounded-xl px-4 h-12 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-[0_4px_20px_rgba(251,191,36,0.1)] transition-all text-sm font-medium appearance-none cursor-pointer"
                                    value={formData.campusId}
                                    onChange={(e) => setFormData({ ...formData, campusId: e.target.value })}
                                >
                                    <option value="" className="text-neutral-400">Select Campus</option>
                                    {campuses.map(c => (
                                        <option key={c.id} value={c.id} className="text-black">{c.campusName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {(formData.role === 'Alumni' || formData.role === 'Others') && (
                        <div className="space-y-4 animate-in slide-in-from-top-4 fade-in duration-300">
                            <div>
                                <label className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Aadhar Number</label>
                                <input
                                    className="w-full bg-amber-50/30 border border-amber-400 rounded-xl px-4 h-12 text-neutral-900 placeholder-amber-700/30 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-[0_4px_20px_rgba(251,191,36,0.1)] caret-rose-600 transition-all text-sm font-medium"
                                    placeholder="12-digit UIDAI Number"
                                    maxLength={12}
                                    value={formData.aadharNo || ''}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '')
                                        if (val.length <= 12) setFormData({ ...formData, aadharNo: val })
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ml-1">Email Address</label>
                        <input
                            type="email"
                            className={`w-full bg-amber-50/30 border border-amber-400 rounded-xl px-4 h-12 text-neutral-900 placeholder-amber-700/30 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-[0_4px_20px_rgba(251,191,36,0.1)] caret-rose-600 transition-all text-sm font-medium ${formData.email && !validateEmail(formData.email) ? 'ring-rose-500 focus:ring-rose-500 border-rose-500' : ''}`}
                            placeholder="name@example.com"
                            value={formData.email || ''}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        {formData.email && !validateEmail(formData.email) && (
                            <p className="text-[10px] text-rose-500 mt-1 font-medium ml-1">Please enter a valid email address</p>
                        )}
                    </div>

                    {/* Privacy Consent */}
                    <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                        <input
                            type="checkbox"
                            className="mt-1 w-4 h-4 rounded border-neutral-300 bg-white text-amber-600 focus:ring-amber-500 cursor-pointer"
                            checked={agreedToPrivacy}
                            onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                        />
                        <div className="text-[10px] text-neutral-500 leading-relaxed">
                            <span>I agree to the </span>
                            <button type="button" onClick={() => setShowPrivacy(true)} className="text-amber-600 font-bold hover:underline">Privacy Policy</button>
                            <span> and consent to data collection for identity verification.</span>
                        </div>
                    </div>
                </div>
            </div>

            <button
                className={`w-full h-14 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-black font-black tracking-[0.15em] text-sm uppercase shadow-lg shadow-amber-900/20 hover:shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${!isFormValid() || loading ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                onClick={onNext}
                disabled={loading || !isFormValid()}
            >
                Proceed to Payment
            </button>

            <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
        </div>
    )
}
