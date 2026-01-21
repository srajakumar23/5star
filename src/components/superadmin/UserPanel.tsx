'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { User, Campus, BulkUserData } from '@/types'
import { UserTable } from '@/components/superadmin/UserTable'
import { ResetPasswordModal } from '@/components/superadmin/ResetPasswordModal'
import CSVUploader from '@/components/CSVUploader'
import { addUser, updateUser, removeUser, updateUserStatus, bulkAddUsers, purgeUserPermanently } from '@/app/superadmin-actions'

interface UserPanelProps {
    users: User[]
    campuses: Campus[]
    currentUserRole?: string
}

import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

export function UserPanel({ users, campuses, currentUserRole }: UserPanelProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [showAddUserModal, setShowAddUserModal] = useState(false)
    const [showBulkUploadModal, setShowBulkUploadModal] = useState(false)
    const [editingUser, setEditingUser] = useState<any>(null)
    const [modalLoading, setModalLoading] = useState(false)

    // Delete Confirmation State
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean, userId: number | null, userName: string }>({
        isOpen: false,
        userId: null,
        userName: ''
    })
    const [purgeConfirmation, setPurgeConfirmation] = useState<{ isOpen: boolean, userId: number | null, userName: string }>({
        isOpen: false,
        userId: null,
        userName: ''
    })

    // Reset Password State
    const [resetTarget, setResetTarget] = useState<{ id: number, name: string, type: 'user' | 'admin' } | null>(null)
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
    const [userView, setUserView] = useState<'active' | 'archive'>('active')

    const [userForm, setUserForm] = useState({
        fullName: '',
        mobileNumber: '',
        role: 'Parent' as 'Parent' | 'Staff' | 'Alumni' | 'Others',
        assignedCampus: '',
        empId: '',
        childEprNo: '',
        isFiveStarMember: false,
        yearFeeBenefitPercent: 0,
        longTermBenefitPercent: 0
    })

    const openEditUserModal = (user: User) => {
        setEditingUser(user)
        setUserForm({
            fullName: user.fullName,
            mobileNumber: user.mobileNumber,
            role: user.role as any,
            assignedCampus: user.assignedCampus || '',
            empId: user.empId || '',
            childEprNo: user.childEprNo || '',
            isFiveStarMember: user.isFiveStarMember || false,
            yearFeeBenefitPercent: user.yearFeeBenefitPercent || 0,
            longTermBenefitPercent: user.longTermBenefitPercent || 0
        })
        setShowAddUserModal(true)
    }

    const openResetModal = (id: number, name: string, type: 'user' | 'admin') => {
        setResetTarget({ id, name, type })
        setShowResetPasswordModal(true)
    }

    const handleSaveUser = async () => {
        if (!userForm.fullName || !userForm.mobileNumber) {
            toast.error('Name and Mobile are required')
            return
        }
        if (userForm.role === 'Staff' && !userForm.empId) {
            toast.error('Employee ID is required for Staff')
            return
        }

        setModalLoading(true)
        let result
        if (editingUser) {
            result = await updateUser(editingUser.userId, userForm)
        } else {
            result = await addUser(userForm)
        }

        setModalLoading(false)
        if (result.success) {
            setShowAddUserModal(false)
            setEditingUser(null)
            setUserForm({ fullName: '', mobileNumber: '', role: 'Parent', assignedCampus: '', empId: '', childEprNo: '', isFiveStarMember: false, yearFeeBenefitPercent: 0, longTermBenefitPercent: 0 })
            router.refresh()
        } else {
            toast.error(result.error || 'Failed to save user')
        }
    }

    const handleDeleteUser = (id: number, name: string) => {
        setDeleteConfirmation({ isOpen: true, userId: id, userName: name })
    }

    const confirmDeleteUser = async () => {
        if (!deleteConfirmation.userId) return

        const result = await removeUser(deleteConfirmation.userId)
        if (result.success) {
            setDeleteConfirmation({ isOpen: false, userId: null, userName: '' })
            router.refresh()
            toast.success('User archived and number recycled')
        } else {
            toast.error(result.error || 'Failed to delete user')
            setDeleteConfirmation({ isOpen: false, userId: null, userName: '' })
        }
    }

    const handlePurgeUser = (id: number, name: string) => {
        setPurgeConfirmation({ isOpen: true, userId: id, userName: name })
    }

    const confirmPurgeUser = async () => {
        if (!purgeConfirmation.userId) return

        setModalLoading(true)
        const result = await purgeUserPermanently(purgeConfirmation.userId)
        setModalLoading(false)

        if (result.success) {
            setPurgeConfirmation({ isOpen: false, userId: null, userName: '' })
            router.refresh()
            toast.success('User purged permanently')
        } else {
            toast.error(result.error || 'Failed to purge user')
            setPurgeConfirmation({ isOpen: false, userId: null, userName: '' })
        }
    }

    const handleToggleUserStatus = async (userId: number, currentStatus: string) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active'
        const result = await updateUserStatus(userId, newStatus as 'Active' | 'Inactive')
        if (result.success) {
            router.refresh()
        } else {
            toast.error(result.error || 'Failed to update status')
        }
    }

    const handleBulkUpload = async (data: BulkUserData[]): Promise<{ success: boolean; added: number; failed: number; errors: string[] }> => {
        const result = await bulkAddUsers(data)
        if (result.success && result.added > 0) {
            router.refresh()
        }
        return {
            success: result.success,
            added: result.added,
            failed: result.failed,
            errors: result.errors || []
        }
    }

    const filteredUsers = users.filter(user => {
        if (userView === 'active') return user.status !== 'Deleted'
        return user.status === 'Deleted'
    })

    return (
        <div className="space-y-6 animate-fade-in">
            {/* View Toggle */}
            <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-white/20 w-fit shadow-sm">
                <button
                    onClick={() => setUserView('active')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${userView === 'active' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-indigo-600'}`}
                >
                    Active Users
                </button>
                <button
                    onClick={() => setUserView('archive')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${userView === 'archive' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:text-red-600'}`}
                >
                    Archived (Recycled)
                </button>
            </div>

            <UserTable
                users={filteredUsers}
                searchTerm={searchQuery}
                onSearchChange={setSearchQuery}
                onAddUser={() => {
                    setEditingUser(null);
                    setUserForm({ fullName: '', mobileNumber: '', role: 'Parent', assignedCampus: '', empId: '', childEprNo: '', isFiveStarMember: false, yearFeeBenefitPercent: 0, longTermBenefitPercent: 0 });
                    setShowAddUserModal(true)
                }}
                onBulkAdd={() => setShowBulkUploadModal(true)}
                onDelete={(id, name) => handleDeleteUser(id, name)}
                onToggleStatus={handleToggleUserStatus}
                onViewReferrals={(code) => {
                    // Navigate to referrals view with filter
                    router.push(`/superadmin?view=referrals&search=${code}`)
                }}
                onResetPassword={openResetModal}
                onEdit={openEditUserModal}
                onPurge={handlePurgeUser}
            />

            {/* Add User Modal */}
            {
                showAddUserModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>{editingUser ? 'Edit Ambassador' : 'Add New User'}</h3>
                                <button onClick={() => { setShowAddUserModal(false); setEditingUser(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Full Name *</label>
                                    <input
                                        type="text"
                                        value={userForm.fullName}
                                        onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px' }}
                                        placeholder="Enter full name"
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Mobile Number *</label>
                                    <input
                                        type="tel"
                                        value={userForm.mobileNumber}
                                        onChange={(e) => setUserForm({ ...userForm, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px' }}
                                        placeholder="10 digit mobile number"
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Role *</label>
                                    <select
                                        value={userForm.role}
                                        onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px' }}
                                    >
                                        <option value="Parent">Parent</option>
                                        <option value="Staff">Staff</option>
                                        <option value="Alumni">Alumni</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Assigned Campus</label>
                                    <select
                                        value={userForm.assignedCampus}
                                        onChange={(e) => setUserForm({ ...userForm, assignedCampus: e.target.value })}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px' }}
                                    >
                                        <option value="">Select Campus (Optional)</option>
                                        {campuses.map(c => <option key={c.id} value={c.campusName}>{c.campusName}</option>)}
                                    </select>
                                </div>
                                {userForm.role === 'Staff' && (
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Employee ID *</label>
                                        <input
                                            type="text"
                                            value={userForm.empId}
                                            onChange={(e) => setUserForm({ ...userForm, empId: e.target.value })}
                                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px' }}
                                            placeholder="Enter Staff Employee ID"
                                        />
                                    </div>
                                )}
                                {userForm.role === 'Parent' && (
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Child ERP No</label>
                                        <input
                                            type="text"
                                            value={userForm.childEprNo}
                                            onChange={(e) => setUserForm({ ...userForm, childEprNo: e.target.value })}
                                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px' }}
                                            placeholder="Achariya Child ERP No"
                                        />
                                    </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="checkbox"
                                        checked={userForm.isFiveStarMember}
                                        onChange={(e) => setUserForm({ ...userForm, isFiveStarMember: e.target.checked })}
                                        id="isFiveStar"
                                        style={{ width: '16px', height: '16px' }}
                                    />
                                    <label htmlFor="isFiveStar" style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>5-Star Member Status</label>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div>
                                        <label style={{ fontSize: '11px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Year Fee Benefit %</label>
                                        <input
                                            type="number"
                                            value={userForm.yearFeeBenefitPercent}
                                            onChange={(e) => setUserForm({ ...userForm, yearFeeBenefitPercent: Number(e.target.value) })}
                                            style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '11px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Long Term Benefit %</label>
                                        <input
                                            type="number"
                                            value={userForm.longTermBenefitPercent}
                                            onChange={(e) => setUserForm({ ...userForm, longTermBenefitPercent: Number(e.target.value) })}
                                            style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                                    <button
                                        onClick={() => { setShowAddUserModal(false); setEditingUser(null) }}
                                        style={{ flex: 1, padding: '10px', background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveUser}
                                        disabled={modalLoading}
                                        style={{ flex: 1, padding: '10px', background: '#DC2626', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
                                    >
                                        {modalLoading ? 'Saving...' : (editingUser ? 'Update Details' : 'Add User')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Reset Password Modal */}
            <ResetPasswordModal
                isOpen={showResetPasswordModal}
                onClose={() => {
                    setShowResetPasswordModal(false)
                    setResetTarget(null)
                }}
                target={resetTarget}
            />

            {/* Data Import Modal */}
            {showBulkUploadModal && (
                <CSVUploader
                    onClose={() => setShowBulkUploadModal(false)}
                    type="users"
                    onUpload={handleBulkUpload as any}
                    userRole={currentUserRole}
                />
            )}

            {/* Premium Confirm Dialog */}
            <ConfirmDialog
                isOpen={deleteConfirmation.isOpen}
                title="Delete User?"
                description={
                    <p>
                        Are you sure you want to delete <strong>{deleteConfirmation.userName}</strong>?
                        <br />
                        This will remove their access and all associated data.
                    </p>
                }
                confirmText="Yes, Delete User"
                variant="danger"
                onConfirm={confirmDeleteUser}
                onCancel={() => setDeleteConfirmation({ isOpen: false, userId: null, userName: '' })}
            />

            {/* Purge Confirm Dialog */}
            <ConfirmDialog
                isOpen={purgeConfirmation.isOpen}
                title="PURGE USER PERMANENTLY?"
                description={
                    <div className="space-y-4 text-red-600 font-medium">
                        <p>
                            DANGER: You are about to permanently purge <strong>{purgeConfirmation.userName}</strong>.
                        </p>
                        <p className="bg-red-50 p-3 rounded-lg text-xs">
                            This action will erase ALL their financial history, Lead data, and account records forever. This CANNOT be undone.
                        </p>
                    </div>
                }
                confirmText="Yes, Purge Permanently"
                variant="danger"
                onConfirm={confirmPurgeUser}
                onCancel={() => setPurgeConfirmation({ isOpen: false, userId: null, userName: '' })}
                isLoading={modalLoading}
            />
        </div>
    )
}
