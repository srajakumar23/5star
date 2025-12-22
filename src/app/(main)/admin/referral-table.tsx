'use client'

import { CheckCircle, Filter, ChevronDown, Clock, AlertCircle, Phone, MapPin, User } from 'lucide-react'
import { useState, useMemo } from 'react'

interface ReferralTableProps {
    referrals: any[]
    confirmReferral: (leadId: number) => Promise<any>
    initialRoleFilter?: string
    initialStatusFilter?: string
}

export function ReferralTable({ referrals, confirmReferral, initialRoleFilter, initialStatusFilter }: ReferralTableProps) {
    const [roleFilter, setRoleFilter] = useState<string>(initialRoleFilter || 'All')
    const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter || 'All')
    const [campusFilter, setCampusFilter] = useState<string>('All')
    const [searchQuery, setSearchQuery] = useState<string>('')

    // Dropdown states for Excel-like filters
    const [showRoleDropdown, setShowRoleDropdown] = useState(false)
    const [showStatusDropdown, setShowStatusDropdown] = useState(false)
    const [showCampusDropdown, setShowCampusDropdown] = useState(false)

    // Get unique values for filters
    const campuses = useMemo(() => {
        const uniqueCampuses = new Set(referrals.map(r => r.campus))
        return Array.from(uniqueCampuses).sort()
    }, [referrals])

    // Filtered referrals
    const filteredReferrals = useMemo(() => {
        return referrals.filter(r => {
            const matchesRole = roleFilter === 'All' || r.user.role === roleFilter
            const matchesStatus = statusFilter === 'All' || r.leadStatus === statusFilter
            const matchesCampus = campusFilter === 'All' || r.campus === campusFilter
            const matchesSearch = searchQuery === '' ||
                r.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.parentMobile.includes(searchQuery) ||
                r.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())

            return matchesRole && matchesStatus && matchesCampus && matchesSearch
        })
    }, [referrals, roleFilter, statusFilter, campusFilter, searchQuery])

    // Excel-like filter dropdown component
    const FilterDropdown = ({
        show,
        onClose,
        options,
        currentValue,
        onChange
    }: {
        show: boolean
        onClose: () => void
        options: string[]
        currentValue: string
        onChange: (value: string) => void
    }) => {
        if (!show) return null

        return (
            <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                background: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                zIndex: 100,
                minWidth: '180px',
                overflow: 'hidden'
            }}>
                <div style={{ maxHeight: '256px', overflowY: 'auto' }}>
                    <div
                        style={{
                            padding: '10px 16px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            background: currentValue === 'All' ? '#F9FAFB' : 'transparent',
                            fontWeight: currentValue === 'All' ? '700' : '500',
                            color: currentValue === 'All' ? '#EF4444' : '#374151',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#F3F4F6'}
                        onMouseOut={(e) => e.currentTarget.style.background = currentValue === 'All' ? '#F9FAFB' : 'transparent'}
                        onClick={() => {
                            onChange('All')
                            onClose()
                        }}
                    >
                        All
                    </div>
                    {options.map(option => (
                        <div
                            key={option}
                            style={{
                                padding: '10px 16px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                background: currentValue === option ? '#F9FAFB' : 'transparent',
                                fontWeight: currentValue === option ? '700' : '500',
                                color: currentValue === option ? '#EF4444' : '#374151',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#F3F4F6'}
                            onMouseOut={(e) => e.currentTarget.style.background = currentValue === option ? '#F9FAFB' : 'transparent'}
                            onClick={() => {
                                onChange(option)
                                onClose()
                            }}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div style={{
            background: 'white',
            borderRadius: '20px',
            border: '1px solid rgba(229, 231, 235, 0.5)',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)',
            overflow: 'hidden'
        }}>
            <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #F3F4F6',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: 0 }}>Active Referrals</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#6B7280', background: '#F3F4F6', padding: '4px 10px', borderRadius: '20px' }}>
                            {filteredReferrals.length} Leads Found
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                        <Filter size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input
                            type="text"
                            placeholder="Search by parent name or mobile..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            suppressHydrationWarning
                            style={{
                                width: '100%',
                                padding: '10px 12px 10px 36px',
                                background: '#F9FAFB',
                                border: '1px solid #E5E7EB',
                                borderRadius: '12px',
                                fontSize: '14px',
                                color: '#111827',
                                transition: 'all 0.2s',
                                outline: 'none'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.border = '1px solid #EF4444';
                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                                e.currentTarget.style.background = 'white';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.border = '1px solid #E5E7EB';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.background = '#F9FAFB';
                            }}
                        />
                    </div>
                </div>
            </div>

            <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1100px' }}>
                    <thead>
                        <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
                            <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Referrer</th>
                            <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', position: 'relative' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => setShowRoleDropdown(!showRoleDropdown)}>
                                    Role <ChevronDown size={14} />
                                </div>
                                <FilterDropdown
                                    show={showRoleDropdown}
                                    onClose={() => setShowRoleDropdown(false)}
                                    options={['Parent', 'Staff']}
                                    currentValue={roleFilter}
                                    onChange={setRoleFilter}
                                />
                            </th>
                            <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lead Details</th>
                            <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', position: 'relative' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => setShowCampusDropdown(!showCampusDropdown)}>
                                    Campus <ChevronDown size={14} />
                                </div>
                                <FilterDropdown
                                    show={showCampusDropdown}
                                    onClose={() => setShowCampusDropdown(false)}
                                    options={campuses}
                                    currentValue={campusFilter}
                                    onChange={setCampusFilter}
                                />
                            </th>
                            <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Est. Multiplier</th>
                            <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', position: 'relative' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => setShowStatusDropdown(!showStatusDropdown)}>
                                    Status <ChevronDown size={14} />
                                </div>
                                <FilterDropdown
                                    show={showStatusDropdown}
                                    onClose={() => setShowStatusDropdown(false)}
                                    options={['New', 'Follow-up', 'Confirmed']}
                                    currentValue={statusFilter}
                                    onChange={setStatusFilter}
                                />
                            </th>
                            <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReferrals.map((r: any) => {
                            const isNew = r.leadStatus === 'New'
                            const createdDate = new Date(r.createdAt)
                            const hoursOld = (new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60)
                            const isUrgent = isNew && hoursOld > 48

                            return (
                                <tr key={r.leadId} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#F9FAFB'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: r.user.role === 'Staff' ? '#FEE2E2' : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: r.user.role === 'Staff' ? '#EF4444' : '#3B82F6' }}>
                                                <User size={16} />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: 0 }}>{r.user.fullName}</p>
                                                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, fontFamily: 'monospace' }}>{r.user.referralCode}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            background: r.user.role === 'Staff' ? '#FEF2F2' : '#F0F9FF',
                                            color: r.user.role === 'Staff' ? '#DC2626' : '#0284C7',
                                            textTransform: 'uppercase'
                                        }}>
                                            {r.user.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <p style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: 0 }}>{r.parentName}</p>
                                                {isUrgent && (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '10px', fontWeight: '800', color: '#DC2626', background: '#FEF2F2', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                                                        <AlertCircle size={10} /> Urgent
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6B7280' }}>
                                                    <Phone size={12} />
                                                    <span style={{ fontSize: '12px', fontWeight: '500' }}>{r.parentMobile}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6B7280' }}>
                                                    <Clock size={12} />
                                                    <span style={{ fontSize: '12px', fontWeight: '500' }}>
                                                        {hoursOld < 24 ? `${Math.round(hoursOld)}h ago` : `${Math.round(hoursOld / 24)}d ago`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
                                            <MapPin size={14} style={{ color: '#9CA3AF' }} />
                                            <span style={{ fontSize: '13px', fontWeight: '500' }}>{r.campus || 'General'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ background: '#F9FAFB', border: '1px dashed #E5E7EB', padding: '6px 10px', borderRadius: '8px', display: 'inline-block' }}>
                                            <p style={{ fontSize: '14px', fontWeight: '800', color: '#EF4444', margin: 0 }}>
                                                ₹{((r.user.studentFee || 60000) * (r.user.yearFeeBenefitPercent || 0) / 100).toLocaleString('en-IN')}
                                            </p>
                                            <p style={{ fontSize: '10px', fontWeight: '600', color: '#9CA3AF', margin: 0, textTransform: 'uppercase' }}>Multiplier</p>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: r.leadStatus === 'Confirmed' ? '#10B981' : r.leadStatus === 'Follow-up' ? '#F59E0B' : '#6B7280'
                                            }}></div>
                                            <span style={{
                                                fontSize: '13px',
                                                fontWeight: '700',
                                                color: r.leadStatus === 'Confirmed' ? '#059669' : r.leadStatus === 'Follow-up' ? '#D97706' : '#4B5563'
                                            }}>
                                                {r.leadStatus}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                        {r.leadStatus !== 'Confirmed' ? (
                                            <form action={async () => {
                                                await confirmReferral(r.leadId)
                                            }}>
                                                <button style={{
                                                    padding: '8px 16px',
                                                    background: '#EF4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '10px',
                                                    fontSize: '13px',
                                                    fontWeight: '700',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
                                                }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.background = '#DC2626';
                                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(239, 68, 68, 0.3)';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.background = '#EF4444';
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.2)';
                                                    }}
                                                    suppressHydrationWarning
                                                >
                                                    Confirm
                                                </button>
                                            </form>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', color: '#10B981' }}>
                                                <span style={{ fontSize: '13px', fontWeight: '700' }}>Verified</span>
                                                <CheckCircle size={18} />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {filteredReferrals.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 24px', color: '#9CA3AF' }}>
                    <Filter size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                    <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>No matching referrals found</p>
                    <p style={{ fontSize: '14px', margin: '4px 0 0' }}>Try adjusting your filters or search terms</p>
                </div>
            )}
        </div>
    )
}
