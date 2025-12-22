import { getMyReferrals } from '@/app/referral-actions'
import { CheckCircle, Clock, UserCheck } from 'lucide-react'

export default async function ReferralsPage() {
    const referrals = await getMyReferrals()

    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-6">My Referrals</h1>

            {referrals.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-text-secondary mb-4">You haven't made any referrals yet.</p>
                    <p className="text-sm">Start referring to earn benefits!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {referrals.map(referral => (
                        <div key={referral.leadId} className="card flex flex-col md-flex-row md-items-center justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-lg">{referral.parentName}</h3>
                                <p className="text-xs text-text-secondary mt-1">
                                    {referral.campus} • {referral.gradeInterested} • {referral.admittedYear || '2025-2026'}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <StatusBadge status={referral.leadStatus} />
                                {referral.leadStatus === 'Confirmed' && referral.confirmedDate && (
                                    <p className="text-xs text-success ml-2">
                                        {new Date(referral.confirmedDate).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    let colorClass = 'text-text-secondary bg-text-secondary/10'
    let icon = <Clock size={14} />

    if (status === 'Confirmed') {
        colorClass = 'text-success bg-success/10'
        icon = <CheckCircle size={14} />
    } else if (status === 'Follow-up') {
        colorClass = 'text-primary-red bg-primary-red/10'
        icon = <UserCheck size={14} />
    }

    // Since we don't have bg-opacity classes in globals properly for all colors, use inline style or simpler classes
    // I used generic `bg-primary-gold/10` in previous components, but wait, I didn't verify if I added them.
    // I added `text-success` etc., but not bg-success/10. 
    // I will use inline styles for badges to be safe.

    const colors: Record<string, string> = {
        'Confirmed': 'var(--success)',
        'Follow-up': 'var(--primary-red)',
        'New': 'var(--text-secondary)'
    }
    const color = colors[status] || 'gray'

    return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
            style={{ color: color, backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)` }}>
            {icon}
            {status}
        </span>
    )
}
