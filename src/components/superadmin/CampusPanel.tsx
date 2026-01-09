'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { X, Plus, Trash } from 'lucide-react'
import { Campus } from '@/types'
import { CampusManagementTable } from '@/components/superadmin/CampusManagementTable'
import { getCampuses, addCampus, updateCampus, deleteCampus, deleteCampuses } from '@/app/campus-actions'

export function CampusPanel({ campusComparison = [], mode = 'management' }: { campusComparison?: any[], mode?: 'management' | 'performance' }) {
    const [campuses, setCampuses] = useState<Campus[]>([])

    // Merge performance data
    const enrichedCampuses = campuses.map(campus => {
        const perf = campusComparison.find(c => c.campus === campus.campusName)
        return {
            ...campus,
            totalLeads: perf?.totalLeads || 0,
            confirmed: perf?.confirmed || 0,
            conversionRate: perf?.conversionRate || 0
        }
    })
    const [loading, setLoading] = useState(true)
    const [showCampusModal, setShowCampusModal] = useState(false)
    const [editingCampus, setEditingCampus] = useState<any>(null)
    const [campusForm, setCampusForm] = useState({
        campusName: '',
        campusCode: '',
        location: '',
        grades: '',
        maxCapacity: 500,
        gradeFees: [] as Array<{ grade: string; annualFee: number }>
    })
    const [customGradeInput, setCustomGradeInput] = useState('')

    const loadCampuses = async () => {
        setLoading(true)
        try {
            const res = await getCampuses()
            if (res.success && res.campuses) {
                setCampuses(res.campuses)
            } else {
                toast.error('Failed to load campuses')
            }
        } catch (e) {
            toast.error('Error loading campuses')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCampuses()
    }, [])

    const handleSaveCampus = async () => {
        if (!campusForm.campusName || !campusForm.campusCode || !campusForm.grades) {
            toast.error('Please fill required fields (Name, Code, Grades)')
            return
        }

        const payload: any = { ...campusForm }

        let res
        if (editingCampus) {
            res = await updateCampus(editingCampus.id, payload)
        } else {
            res = await addCampus(payload)
        }
        if (res.success) {
            toast.success(editingCampus ? 'Campus updated' : 'Campus added')
            setShowCampusModal(false)
            loadCampuses()
        } else {
            toast.error(res.error || 'Failed to save campus')
        }
    }

    const handleDeleteCampus = async (id: number) => {
        const result = await deleteCampus(id, false)
        if (result.success) {
            toast.success('Campus deleted successfully')
            loadCampuses()
        } else {
            if (result.requiresForce) {
                if (confirm(`${result.error}\n\nDo you want to FORCE DELETE? This will permanently delete all associated students and data.`)) {
                    const forceResult = await deleteCampus(id, true)
                    if (forceResult.success) {
                        toast.success('Campus force deleted successfully')
                        loadCampuses()
                    } else {
                        toast.error(forceResult.error || 'Failed to force delete campus')
                    }
                }
            } else {
                toast.error(result.error || 'Failed to delete campus')
            }
        }
    }

    const handleBulkDelete = async (ids: number[]) => {
        if (!confirm(`Are you sure you want to delete ${ids.length} campuses? This action cannot be undone.`)) return
        const result = await deleteCampuses(ids)
        if (result.success) {
            toast.success('Campuses deleted successfully')
            loadCampuses()
        } else {
            if (result.requiresForce) {
                if (confirm(`${result.error}\n\nDo you want to FORCE DELETE these campuses? This will permanently delete ALL students associated with them.`)) {
                    const forceResult = await deleteCampuses(ids, true)
                    if (forceResult.success) {
                        toast.success('Campuses force deleted successfully')
                        loadCampuses()
                    } else {
                        toast.error(forceResult.error || 'Failed to force delete campuses')
                    }
                }
            } else {
                toast.error(result.error || 'Failed to delete campuses')
            }
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <CampusManagementTable
                mode={mode}
                campuses={enrichedCampuses}
                onAdd={() => {
                    setEditingCampus(null)
                    setCampusForm({
                        campusName: '',
                        campusCode: '',
                        location: '',
                        grades: '',
                        maxCapacity: 500,
                        gradeFees: []
                    })
                    setShowCampusModal(true)
                }}
                onEdit={(campus: any) => {
                    setEditingCampus(campus)
                    setCampusForm({
                        campusName: campus.campusName,
                        campusCode: campus.campusCode,
                        location: campus.location,
                        grades: campus.grades || '9-12',
                        maxCapacity: campus.maxCapacity || 500,
                        gradeFees: campus.gradeFees || []
                    })
                    setShowCampusModal(true)
                }}
                onDelete={handleDeleteCampus}
                onBulkDelete={handleBulkDelete}
            />

            {/* Campus Modal */}
            {
                showCampusModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
                        <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>
                                    {editingCampus ? 'Edit Campus' : 'Add New Campus'}
                                </h2>
                                <button onClick={() => setShowCampusModal(false)} style={{ color: '#9CA3AF', cursor: 'pointer', background: 'none', border: 'none' }}><X size={24} /></button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Campus Name</label>
                                    <input
                                        type="text"
                                        value={campusForm.campusName}
                                        onChange={(e) => setCampusForm({ ...campusForm, campusName: e.target.value })}
                                        placeholder="e.g. ASM-PUDUCHERRY"
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '14px' }}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Campus Code</label>
                                        <input
                                            type="text"
                                            value={campusForm.campusCode}
                                            onChange={(e) => setCampusForm({ ...campusForm, campusCode: e.target.value })}
                                            placeholder="PUDU-01"
                                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '14px' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Location</label>
                                        <input
                                            type="text"
                                            value={campusForm.location}
                                            onChange={(e) => setCampusForm({ ...campusForm, location: e.target.value })}
                                            placeholder="Puducherry"
                                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '14px' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ height: '1px', background: '#E5E7EB', margin: '20px 0' }}></div>

                            <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }}>
                                <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>School Grades</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        "Pre-Mont", "Pre Mont FD", "Pre Mont HD", "Pre Mont TD",
                                        "Mont-1", "Mont-2",
                                        "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
                                        "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
                                        "Grade 11", "Grade 12"
                                    ].map((grade) => {
                                        const currentGrades = campusForm.grades ? campusForm.grades.split(',').map(g => g.trim()) : []
                                        const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
                                        const isSelected = currentGrades.some(g => norm(g) === norm(grade))

                                        return (
                                            <label key={grade} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50 border border-transparent hover:border-200 transition-all">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={(e) => {
                                                        let newGrades = [...currentGrades]

                                                        if (e.target.checked) {
                                                            if (!isSelected) newGrades.push(grade)
                                                        } else {
                                                            newGrades = newGrades.filter(g => norm(g) !== norm(grade))
                                                        }

                                                        // Define standard order
                                                        const standardOrder = [
                                                            "Pre-Mont", "Pre Mont FD", "Pre Mont HD", "Pre Mont TD",
                                                            "Mont-1", "Mont-2",
                                                            "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
                                                            "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
                                                            "Grade 11", "Grade 12"
                                                        ]

                                                        // Sort based on standard order
                                                        newGrades.sort((a, b) => {
                                                            const idxA = standardOrder.findIndex(s => norm(s) === norm(a))
                                                            const idxB = standardOrder.findIndex(s => norm(s) === norm(b))
                                                            // If not found in standard (custom grade?), put at end
                                                            return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB)
                                                        })

                                                        // Deduplicate just in case
                                                        newGrades = [...new Set(newGrades)]

                                                        setCampusForm({ ...campusForm, grades: newGrades.join(', ') })
                                                    }}
                                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
                                                />
                                                <span className="text-xs font-medium text-gray-700">{grade}</span>
                                            </label>
                                        )
                                    })}
                                </div>
                                {/* Custom Courses / College Grades Section */}
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-6 mb-2">
                                    <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>College Courses / Custom Tags</h3>
                                    <p className="text-[11px] text-gray-500 mb-4">
                                        Manage specific courses (e.g., B.Tech, MBA) for college campuses.
                                    </p>

                                    {/* Display Active Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {(() => {
                                            const currentGrades = campusForm.grades ? campusForm.grades.split(',').map(g => g.trim()).filter(Boolean) : []
                                            const standardGrades = [
                                                "Pre-Mont", "Pre Mont FD", "Pre Mont HD", "Pre Mont TD",
                                                "Mont-1", "Mont-2",
                                                "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
                                                "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
                                                "Grade 11", "Grade 12"
                                            ]
                                            const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

                                            // Get only non-standard grades
                                            const customTags = currentGrades.filter(g => !standardGrades.some(s => norm(s) === norm(g)))

                                            if (customTags.length === 0) return <p className="text-xs text-gray-400 italic">No custom courses added.</p>

                                            return customTags.map((tag, idx) => (
                                                <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                                                    {tag}
                                                    <button
                                                        onClick={() => {
                                                            const newGrades = currentGrades.filter(g => g !== tag)
                                                            setCampusForm({ ...campusForm, grades: newGrades.join(', ') })
                                                        }}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))
                                        })()}
                                    </div>

                                    {/* Add New Tag Input */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={customGradeInput}
                                            onChange={(e) => setCustomGradeInput(e.target.value)}
                                            placeholder="Enter course name (e.g. B.Tech)"
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault()
                                                    if (customGradeInput.trim()) {
                                                        const newTag = customGradeInput.trim()
                                                        const currentGrades = campusForm.grades ? campusForm.grades.split(',').map(g => g.trim()).filter(Boolean) : []
                                                        if (!currentGrades.includes(newTag)) {
                                                            setCampusForm({ ...campusForm, grades: [...currentGrades, newTag].join(', ') })
                                                        }
                                                        setCustomGradeInput('')
                                                    }
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                if (customGradeInput.trim()) {
                                                    const newTag = customGradeInput.trim()
                                                    const currentGrades = campusForm.grades ? campusForm.grades.split(',').map(g => g.trim()).filter(Boolean) : []
                                                    if (!currentGrades.includes(newTag)) {
                                                        setCampusForm({ ...campusForm, grades: [...currentGrades, newTag].join(', ') })
                                                    }
                                                    setCustomGradeInput('')
                                                }
                                            }}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                                        >
                                            <Plus size={16} />
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => setShowCampusModal(false)}
                                    className="px-4 py-2 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveCampus}
                                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors"
                                >
                                    {editingCampus ? 'Update Campus' : 'Create Campus'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
