'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { adminResetPassword } from '@/app/superadmin-actions'

interface ResetTarget {
    id: number
    name: string
    type: 'user' | 'admin'
}

interface ResetPasswordModalProps {
    isOpen: boolean
    onClose: () => void
    target: ResetTarget | null
}

export function ResetPasswordModal({ isOpen, onClose, target }: ResetPasswordModalProps) {
    const [newPassword, setNewPassword] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen) setNewPassword('')
    }, [isOpen])

    const handleExecuteReset = async () => {
        if (!target || !newPassword) return
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        setLoading(true)
        try {
            const res = await adminResetPassword(target.id, target.type, newPassword)
            if (res.success) {
                toast.success(`Password reset successfully for ${target.name}`)
                onClose()
            } else {
                toast.error(res.error || 'Failed to reset password')
            }
        } catch (e) {
            toast.error('An error occurred during password reset')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen || !target) return null

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Reset Password</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                    Set a new password for <strong>{target.name}</strong> ({target.type}).
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>New Password *</label>
                        <input
                            type="text"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px' }}
                            placeholder="Enter new password"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Min 6 characters required.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                        <button
                            onClick={onClose}
                            style={{ flex: 1, padding: '10px', background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleExecuteReset}
                            disabled={loading}
                            style={{ flex: 1, padding: '10px', background: '#DC2626', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
                        >
                            {loading ? 'Resetting...' : 'Confirm Reset'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
