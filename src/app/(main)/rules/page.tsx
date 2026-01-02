import { Star } from 'lucide-react'

export default function RulesPage() {
    const benefits = [
        { count: 1, percent: 5 },
        { count: 2, percent: 10 },
        { count: 3, percent: 25 }, // Jump
        { count: 4, percent: 30 },
        { count: 5, percent: 50 },
    ]

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <h1 className="text-2xl font-bold mb-6 text-primary-red">Program Rules & Benefits</h1>

            <div className="card mb-8">
                <h2 className="text-xl font-bold mb-4">How it works</h2>
                <ul className="list-disc pl-5 space-y-2 text-text-secondary">
                    <li>Refer parents to Achariya. If they join, you enjoy rewards!</li>
                    <li>Benefits apply to your Child's Fee or Bank Transfer (for Staff).</li>
                    <li><strong>Activation:</strong> Just 1 Confirmed Referral per year keeps benefits active.</li>
                </ul>
            </div>

            <div className="card mb-8">
                <h2 className="text-xl font-bold mb-4 text-primary-red">This Year Benefits (Short Term)</h2>
                <div className="space-y-4">
                    {benefits.map(b => (
                        <div key={b.count} className="flex items-center justify-between p-3 bg-deep rounded border border-border-color">
                            <span className="font-bold">{b.count} Referral{b.count > 1 ? 's' : ''}</span>
                            <span className="text-success font-bold text-lg">{b.percent}% Benefit</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card mb-8">
                <h2 className="text-xl font-bold mb-4 text-primary-red">Long Term Benefits (From 2nd Year)</h2>
                <div className="p-4 bg-primary-blue/10 rounded border border-primary-blue/20">
                    <h3 className="font-bold mb-2">Exclusive for 5-Star Ambassadors</h3>
                    <p className="text-sm text-text-secondary mb-4">
                        If you complete <strong>5 Referrals</strong> this year, you qualify for Long Term Benefits next year.
                    </p>
                    <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                            <span>Base Benefit (Immediate)</span>
                            <span className="font-bold">15%</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Per New Referral (Next Year)</span>
                            <span className="font-bold">+ 5% Extra</span>
                        </li>
                    </ul>
                    <p className="text-xs text-text-secondary mt-4 italic">
                        * Requires minimum 1 referral in the new year to unlock.
                    </p>
                </div>
            </div>

            <div className="card bg-error/10 border-error" style={{ borderColor: 'var(--error)', background: 'rgba(255, 85, 85, 0.05)' }}>
                <p className="font-bold text-error">Enrollment closes on 31 January 2026.</p>
                <p className="text-sm mt-1">பதிவு கடைசி தேதி: 31 ஜனவரி 2026.</p>
            </div>
        </div>
    )
}
