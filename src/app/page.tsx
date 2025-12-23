'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { sendOtp, verifyOtpOnly, loginUser, registerUser, getLoginRedirect, getRegistrationCampuses } from './actions'
import { Star, ShieldCheck, User, CreditCard, GraduationCap } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Mobile, 2: OTP, 3: Register Details
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)
  const [loading, setLoading] = useState(false)

  // Registration Form State
  const [formData, setFormData] = useState({
    fullName: '',
    role: 'Parent',
    childInAchariya: 'Yes',
    childName: '',
    grade: 'Grade 1',
    campusId: '',
    bankAccountDetails: '',
    transactionId: '',
    childEprNo: '',
    empId: '',
    aadharNo: '',
    email: ''
  })
  const [campuses, setCampuses] = useState<any[]>([])

  const handleSendOtp = async () => {
    if (mobile.length < 10) return alert('Enter valid mobile')
    setLoading(true)
    try {
      const res = await sendOtp(mobile)
      setLoading(false)
      if (res && res.success) {
        setIsNewUser(!res.exists)
        setStep(2)
      } else {
        // Display error message (e.g., registration disabled)
        alert(res?.error || 'Failed to send OTP. Please try again.')
      }
    } catch (error: any) {
      setLoading(false)
      alert('Connection error: ' + (error.message || 'Please try again'))
    }
  }

  const handleVerifyOtp = async () => {
    if (otp !== '123') return alert('Invalid OTP (hint: 123)')
    setLoading(true)
    const valid = await verifyOtpOnly(otp)
    if (valid) {
      if (isNewUser) {
        setStep(3)
        setLoading(false)
        // Fetch campuses
        const res = await getRegistrationCampuses()
        if (res.success && res.campuses) setCampuses(res.campuses)
      } else {
        const result = await loginUser(mobile)
        if (result.success) {
          const redirectPath = await getLoginRedirect(mobile)
          router.push(redirectPath)
        } else {
          alert('Login failed')
          setLoading(false)
        }
      }
    } else {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    // Validate
    if (!formData.fullName) return alert('Name Required')

    setLoading(true)
    const res = await registerUser({
      ...formData,
      mobileNumber: mobile
    })

    if (res.success) {
      router.push('/dashboard')
    } else {
      alert(res.error)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-premium-pink">
      {/* Decorative background elements for "Elite" feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#DE0C78] opacity-20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#700124] opacity-30 blur-[120px] rounded-full"></div>

      <div className="relative z-10 w-full max-w-sm animate-fade-in mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-10">
          {/* Achariya Logo with premium elevation */}
          <div className="mb-8 relative inline-block">
            <div className="absolute inset-0 bg-white/10 blur-[20px] rounded-full"></div>
            <img
              src="https://achariya.in/wp-content/uploads/2025/01/Achariya-Logo-01-scaled.avif"
              alt="Achariya Logo"
              className="mx-auto relative z-10"
              style={{ height: '110px', width: 'auto', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))' }}
            />
          </div>

          <div className="flex flex-col items-center justify-center gap-3 mb-4">
            <div className="flex items-center gap-0 mb-4 justify-center -space-x-3">
              {[1, 2, 3, 4, 5].map((i, index) => {
                // Pyramid sizing: Middle biggest, then neighbors, then ends
                let size = 45; // Default (ends)
                if (index === 2) size = 85;       // Middle
                else if (index === 1 || index === 3) size = 60; // Inner neighbors

                // Staggered delay for "wave" effect outward from center
                const delay = Math.abs(index - 2) * 100;

                return (
                  <div key={i} className="animate-pulse-gold relative" style={{ animationDelay: `${delay}ms` }}>
                    <div className="absolute inset-0 bg-yellow-400 blur-md opacity-40 rounded-full scale-75"></div>
                    <Star
                      size={size}
                      fill="#FFD700"
                      stroke="none"
                      className="gold-glow relative z-10"
                    />
                  </div>
                )
              })}
            </div>
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '700',
              color: '#FFFFFF',
              lineHeight: '1',
              textShadow: '0 4px 12px rgba(0,0,0,0.5)',
              fontFamily: 'var(--font-heading)',
              margin: 0
            }}>
              Ambassador
            </h1>
          </div>

          <div className="inline-block px-6 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
            <p className="text-lg font-bold uppercase tracking-[3px]" style={{
              background: 'linear-gradient(90deg, #FFD700, #FDB931, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              25th Year Celebration
            </p>
          </div>
        </div>

        {/* Form Section - No Card */}
        <div className="mt-8">
          <div className="relative">
            {step === 1 && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '32px', textAlign: 'center', color: '#FFFFFF' }}>Member Access</h2>

                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                  <label style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'block' }}>Mobile Identity</label>
                  <input
                    type="tel"
                    className="w-full bg-white border border-white/50 rounded-xl px-4 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FFD700] transition-all text-xl font-medium tracking-wide text-center"
                    placeholder="00000 00000"
                    value={mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      if (value.length <= 10) {
                        setMobile(value)
                      }
                    }}
                    maxLength={10}
                  />
                  {mobile.length > 0 && mobile.length < 10 && (
                    <p style={{ fontSize: '10px', color: '#F87171', marginTop: '8px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '-0.05em', padding: '0 4px' }}>Incomplete Identity Number</p>
                  )}
                </div>

                <button
                  className="w-full py-4 rounded-xl transition-all active:scale-[0.98] bg-white text-[#CC0000] font-bold tracking-widest text-sm uppercase hover:bg-gray-100"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : 'Secure Access'}
                </button>

                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ height: '1px', width: '100%', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)', marginBottom: '24px' }}></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    <ShieldCheck size={14} />
                    <span>Identity Verification: 123</span>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px', textAlign: 'center', color: '#FFFFFF' }}>Verify Secret</h2>
                <p style={{ fontSize: '12px', textAlign: 'center', marginBottom: '32px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Identity: +91 {mobile}</p>

                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                  <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'block' }}>OTP Code</label>
                  <input
                    type="password"
                    className="w-full bg-white border border-white/50 rounded-xl px-4 py-5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FFD700] transition-all text-4xl font-bold tracking-[1rem] text-center"
                    placeholder="••••"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>

                <button
                  className="w-full py-4 rounded-xl transition-all active:scale-[0.98] bg-white text-[#CC0000] font-bold tracking-widest text-sm uppercase hover:bg-gray-100"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Unlock Dashboard'}
                </button>

                <button
                  style={{ width: '100%', marginTop: '16px', padding: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setStep(1)}
                >
                  Revise Identity Number
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px', textAlign: 'center', color: '#FFFFFF' }}>Elite Profile</h2>
                <p style={{ fontSize: '10px', textAlign: 'center', marginBottom: '32px', color: '#FFD700', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '3px' }}>Welcome Ambassador</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px', display: 'block' }}>Full Membership Name</label>
                    <input
                      className="w-full bg-white border border-white/20 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-all font-bold tracking-wide"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'block' }}>Membership Designation</label>
                    <div className="flex gap-2">
                      {/* Parent Option */}
                      <div
                        onClick={() => setFormData({ ...formData, role: 'Parent' })}
                        className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-xl cursor-pointer transition-all border ${formData.role === 'Parent' ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                      >
                        <User size={18} color={formData.role === 'Parent' ? '#FFD700' : 'rgba(255,255,255,0.4)'} />
                        <span style={{ fontSize: '10px', fontWeight: '700', color: formData.role === 'Parent' ? '#FFFFFF' : 'rgba(255,255,255,0.4)' }}>Parent</span>
                      </div>

                      {/* Staff Option */}
                      <div
                        onClick={() => setFormData({ ...formData, role: 'Staff' })}
                        className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-xl cursor-pointer transition-all border ${formData.role === 'Staff' ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                      >
                        <ShieldCheck size={18} color={formData.role === 'Staff' ? '#FFD700' : 'rgba(255,255,255,0.4)'} />
                        <span style={{ fontSize: '10px', fontWeight: '700', color: formData.role === 'Staff' ? '#FFFFFF' : 'rgba(255,255,255,0.4)' }}>Staff</span>
                      </div>

                      {/* Alumni Option */}
                      <div
                        onClick={() => setFormData({ ...formData, role: 'Alumni' })}
                        className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-xl cursor-pointer transition-all border ${formData.role === 'Alumni' ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                      >
                        <GraduationCap size={18} color={formData.role === 'Alumni' ? '#FFD700' : 'rgba(255,255,255,0.4)'} />
                        <span style={{ fontSize: '10px', fontWeight: '700', color: formData.role === 'Alumni' ? '#FFFFFF' : 'rgba(255,255,255,0.4)' }}>Alumni/Other</span>
                      </div>
                    </div>
                  </div>

                  {/* Use specific content based on Role */}
                  {formData.role === 'Parent' && (
                    /* Parent Form Flow */
                    <div className="flex flex-col gap-4">
                      <div>
                        <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px', display: 'block' }}>Child EPR NO</label>
                        <input
                          className="w-full bg-white border border-white/20 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-all font-bold tracking-wide"
                          placeholder="Enter Child EPR Number"
                          value={formData.childEprNo || ''}
                          onChange={(e) => setFormData({ ...formData, childEprNo: e.target.value })}
                        />
                      </div>

                      <div>
                        <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px', display: 'block' }}>Mail ID</label>
                        <input
                          type="email"
                          className="w-full bg-white border border-white/20 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-all font-bold tracking-wide"
                          placeholder="parent@example.com"
                          value={formData.email || ''}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {formData.role === 'Staff' && (
                    /* Staff Form Flow */
                    <div className="flex flex-col gap-4">
                      <div>
                        <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px', display: 'block' }}>Emp.ID</label>
                        <input
                          className="w-full bg-white border border-white/20 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-all font-bold tracking-wide"
                          placeholder="Enter Employee ID"
                          value={formData.empId || ''}
                          onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                        />
                      </div>

                      <div>
                        <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px', display: 'block' }}>Mail ID</label>
                        <input
                          type="email"
                          className="w-full bg-white border border-white/20 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-all font-bold tracking-wide"
                          placeholder="staff@example.com"
                          value={formData.email || ''}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>

                      <div>
                        <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px', display: 'block' }}>Campus Currently Working</label>
                        <select
                          className="w-full bg-white border border-white/20 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-[#FFD700] transition-all text-xs appearance-none font-bold tracking-wide"
                          value={formData.campusId}
                          onChange={(e) => setFormData({ ...formData, campusId: e.target.value })}
                        >
                          <option value="" className="text-gray-500">Select Your Campus</option>
                          {campuses.map(c => (
                            <option key={c.id} value={c.id} className="text-black">{c.campusName}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {formData.role === 'Alumni' && (
                    /* Alumni/Other Form Flow */
                    <div className="flex flex-col gap-4">
                      <div>
                        <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px', display: 'block' }}>Your Aadhar No</label>
                        <input
                          className="w-full bg-white border border-white/20 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-all font-bold tracking-wide"
                          placeholder="Enter 12-digit Aadhar Number"
                          maxLength={12}
                          value={formData.aadharNo || ''}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '')
                            if (val.length <= 12) setFormData({ ...formData, aadharNo: val })
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px', display: 'block' }}>Mail ID</label>
                        <input
                          type="email"
                          className="w-full bg-white border border-white/20 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-all font-bold tracking-wide"
                          placeholder="you@example.com"
                          value={formData.email || ''}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    className={`w-full relative group overflow-hidden py-4 rounded-xl transition-all active:scale-[0.98] mt-4 ${
                      // Strict Validation Logic
                      (!formData.fullName || !formData.email ||
                        (formData.role === 'Parent' && !formData.childEprNo) ||
                        (formData.role === 'Staff' && (!formData.empId || !formData.campusId)) ||
                        (formData.role === 'Alumni' && !formData.aadharNo)
                      ) ? 'opacity-50 cursor-not-allowed grayscale' : ''
                      }`}
                    onClick={() => {
                      // Strict check before proceeding
                      if (!formData.fullName) return;
                      if (!formData.email) return;

                      if (formData.role === 'Parent') {
                        if (!formData.childEprNo) return;
                      }
                      else if (formData.role === 'Staff') {
                        if (!formData.empId || !formData.campusId) return;
                      }
                      else if (formData.role === 'Alumni') {
                        if (!formData.aadharNo) return;
                      }

                      setStep(4)
                    }}
                    disabled={loading ||
                      (!formData.fullName || !formData.email ||
                        (formData.role === 'Parent' && !formData.childEprNo) ||
                        (formData.role === 'Staff' && (!formData.empId || !formData.campusId)) ||
                        (formData.role === 'Alumni' && !formData.aadharNo)
                      )
                    }
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#DAB200] group-hover:from-[#FFE04D] group-hover:to-[#E6C200] transition-all"></div>
                    <span className="relative z-10 text-black font-extrabold tracking-widest text-xs uppercase">
                      Proceed to Payment &raquo;
                    </span>
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px', textAlign: 'center', color: '#FFFFFF' }}>Secure Payment</h2>
                <p style={{ fontSize: '10px', textAlign: 'center', marginBottom: '24px', color: '#FFD700', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '3px' }}>Final Step</p>

                <div className="bg-white/10 p-6 rounded-2xl mb-6 text-center border border-white/10 backdrop-blur-md">
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-4">Scan to Pay Rs. 1000</p>

                  {/* Placeholder QR Code */}
                  <div className="w-48 h-48 mx-auto bg-white p-2 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 border-[4px] border-black opacity-10"></div>
                    <div className="absolute top-2 left-2 w-10 h-10 border-[4px] border-black"></div>
                    <div className="absolute top-2 right-2 w-10 h-10 border-[4px] border-black"></div>
                    <div className="absolute bottom-2 left-2 w-10 h-10 border-[4px] border-black"></div>
                    <p className="text-black font-bold text-xl tracking-widest">QR CODE</p>
                  </div>

                  <p className="text-white text-xs font-bold">Achariya Educational Public Trust</p>
                  <p className="text-[#FFD700] text-xs font-mono mt-1">UPI: achariya@okicici</p>
                </div>

                <div className="mb-6">
                  <label className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-2 block">Enter Transaction ID / Ref No.</label>
                  <input
                    className="w-full bg-white border border-white/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-[#FFD700]/40 transition-all font-mono text-center tracking-widest text-lg placeholder-black/50"
                    placeholder="e.g. 352627181920"
                    value={formData.transactionId || ''}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-4 rounded-xl border border-white/10 text-white/60 font-bold text-xs uppercase hover:bg-white/5 transition-all"
                  >
                    Back
                  </button>
                  <button
                    className="flex-[2] relative group overflow-hidden py-4 rounded-xl transition-all active:scale-[0.98]"
                    onClick={handleRegister}
                    disabled={loading || !formData.transactionId}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#DAB200] group-hover:from-[#FFE04D] group-hover:to-[#E6C200] transition-all"></div>
                    <span className="relative z-10 text-black font-extrabold tracking-widest text-xs uppercase">
                      {loading ? 'Finalizing...' : 'Complete Registration'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <p style={{ marginTop: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.9)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '4px' }}>
          © 2025 Achariya Group of Institutions
        </p>
      </div>
    </main >
  )
}
