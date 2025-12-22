'use client'

import { useState } from 'react'
import { submitReferral } from '@/app/referral-actions'
import { useRouter } from 'next/navigation'

export default function ReferPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        parentName: '',
        parentMobile: '',
        campus: 'ASM-VILLIANUR(9-12)',
        gradeInterested: ''
    })

    // Official Campus List (Top 10)
    const campuses = [
        "ASM-VILLIANUR(9-12)", "ASM-VILLIANUR(MONT-8)", "ASM-VILLUPURAM", "ASM-ALAPAKKAM",
        "ADYAR", "AKLAVYA-RP", "KKNAGAR", "VALASARAVAKKAM", "ASM-MP", "ASM-TKM"
    ]

    const handleSubmit = async () => {
        setLoading(true)
        const res = await submitReferral(formData)
        setLoading(false)

        if (res.success) {
            alert('Referral submitted successfully. Benefits apply after admission confirmation. / பரிந்துரை பதிவு செய்யப்பட்டது.')
            router.push('/dashboard')
        } else {
            alert(res.error)
        }
    }

    return (
        <div className="animate-fade-in max-w-lg m-auto">
            <h1 className="text-2xl font-bold mb-6">Refer a Parent</h1>

            <div className="card">
                <div className="input-group">
                    <label className="label">Parent Name / பெற்றோரின் பெயர்</label>
                    <input
                        className="input"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        placeholder="Enter parent name"
                    />
                </div>

                <div className="input-group">
                    <label className="label">Parent Mobile / மொபைல் எண்</label>
                    <input
                        type="tel"
                        className="input"
                        value={formData.parentMobile}
                        onChange={(e) => setFormData({ ...formData, parentMobile: e.target.value })}
                        placeholder="9876543210"
                    />
                </div>

                <div className="input-group">
                    <label className="label">Campus</label>
                    <select
                        className="input"
                        value={formData.campus}
                        onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                    >
                        {campuses.map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>

                <div className="input-group">
                    <label className="label">Grade Interested</label>
                    <input
                        className="input"
                        value={formData.gradeInterested}
                        onChange={(e) => setFormData({ ...formData, gradeInterested: e.target.value })}
                        placeholder="e.g. Grade 1"
                    />
                </div>

                <button className="btn btn-primary mt-4" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Referral'}
                </button>
            </div>
        </div>
    )
}
