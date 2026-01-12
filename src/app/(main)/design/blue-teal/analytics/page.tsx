import { getCurrentUser } from '@/lib/auth-service'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, AlertCircle, TrendingUp, Wallet, ArrowLeft, Star, Award, Zap } from 'lucide-react'
import { YearDropdown } from '../../../dashboard/year-dropdown'

export default async function AnalyticsDesignPage() {
    const user = await getCurrentUser()
    if (!user) redirect('/')

    // Check admin roles
    if (user.role === 'Super Admin') redirect('/superadmin')
    if (user.role.includes('Campus')) redirect('/campus')
    if (user.role.includes('Admin')) redirect('/admin')

    const userData = user as any;
    const isBenefitActive = userData.benefitStatus === 'Active'

    // Fee Calculation
    const totalFee = userData.studentFee || 60000
    const benefitPercent = userData.yearFeeBenefitPercent || 0
    const benefitValue = (totalFee * benefitPercent) / 100

    const tiers = [
        { count: 1, percent: 5 },
        { count: 2, percent: 10 },
        { count: 3, percent: 25 },
        { count: 4, percent: 30 },
        { count: 5, percent: 50 }
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">

            {/* Deep Purple Header - Brand Primary */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-800 border-b border-blue-900">
                <div className="px-6 py-8 max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/design/blue-teal" className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 transition-all">
                            <ArrowLeft size={18} className="text-white" strokeWidth={2} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-white">
                                Analytics
                            </h1>
                            <p className="text-blue-100 text-sm font-medium mt-0.5 flex items-center gap-1.5">
                                <Zap size={12} className="text-blue-200" />
                                Performance Insights
                            </p>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20 flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-blue-100 uppercase tracking-wider">Year</span>
                        <YearDropdown currentYear={userData.academicYear || '2025-2026'} />
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

                {/* Key Metrics Grid - Strategic Color Use */}
                <div className="grid md:grid-cols-3 gap-5">

                    {/* Total Referrals - Cohesive Blue Theme */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-5">
                            <div className="w-11 h-11 bg-white/20 rounded-lg flex items-center justify-center">
                                <TrendingUp size={20} strokeWidth={2} />
                            </div>
                            <p className="text-[10px] font-semibold text-blue-100 uppercase tracking-wider">
                                Total Referrals
                            </p>
                        </div>
                        <h3 className="text-6xl font-semibold tracking-tight mb-2">
                            {userData.confirmedReferralCount}
                        </h3>
                        <p className="text-sm text-blue-100 font-medium">Confirmed Families</p>
                    </div>

                    {/* Fee Benefit - Semantic Emerald */}
                    <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 text-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-5">
                            <div className="w-11 h-11 bg-white/20 rounded-lg flex items-center justify-center border border-white/20">
                                <Wallet size={20} strokeWidth={2} />
                            </div>
                            <p className="text-[10px] font-semibold text-emerald-100 uppercase tracking-wider">
                                Fee Benefit
                            </p>
                        </div>
                        <h3 className="text-6xl font-semibold tracking-tight mb-2">
                            {benefitPercent}%
                        </h3>
                        <p className="text-sm text-white/90 font-medium">₹{benefitValue.toLocaleString('en-IN')} Savings</p>
                    </div>

                    {/* Status - Semantic (Green/Amber) */}
                    <div className={`rounded-xl p-6 shadow-sm ${isBenefitActive
                        ? 'bg-emerald-50 border-2 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
                        : 'bg-amber-50 border-2 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
                        }`}>
                        <div className="flex items-center justify-between mb-5">
                            <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${isBenefitActive
                                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400'
                                : 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400'
                                }`}>
                                {isBenefitActive ? <CheckCircle size={20} strokeWidth={2} /> : <AlertCircle size={20} strokeWidth={2} />}
                            </div>
                            <p className={`text-[10px] font-semibold uppercase tracking-wider ${isBenefitActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                                }`}>
                                Status
                            </p>
                        </div>
                        <h3 className={`text-3xl font-semibold tracking-tight mb-2 ${isBenefitActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                            }`}>
                            {isBenefitActive ? 'Active' : 'Pending'}
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                            {isBenefitActive ? 'Benefits Applied' : 'Complete 1 Referral'}
                        </p>
                    </div>
                </div>

                {/* Benefit Structure - Purple accent */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-700 rounded-sm" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">Benefit Structure</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-0.5">Fee Reduction Tiers</p>
                        </div>
                    </div>

                    {/* Short Term Grid - Purple Gradient Scale */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle size={12} className="text-blue-600" />
                            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Short Term (Current Year)</span>
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                            {tiers.map((tier, index) => {
                                const isCurrentTier = userData.confirmedReferralCount === tier.count
                                const isAchieved = userData.confirmedReferralCount >= tier.count

                                // Purple gradient scale - professional progression
                                const getCardClasses = () => {
                                    if (isCurrentTier) {
                                        // Active tier - solid purple gradient
                                        return 'bg-gradient-to-br from-pink-600 to-pink-700 text-white scale-105 z-10 shadow-lg'
                                    }
                                    if (isAchieved) {
                                        // Achieved - light purple
                                        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900'
                                    }
                                    // Not achieved - grey
                                    return 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                                }

                                return (
                                    <div key={tier.count} className={`relative py-5 px-2 rounded-lg text-center border transition-all duration-200 ${getCardClasses()}`}>
                                        <div className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${isCurrentTier ? 'text-white' : isAchieved ? 'text-blue-600 dark:text-pink-400' : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                            {tier.count} Ref{tier.count > 1 ? 's' : ''}
                                        </div>
                                        <div className={`text-3xl font-semibold tracking-tight ${isCurrentTier ? 'text-white' : isAchieved ? 'text-pink-700 dark:text-pink-300' : 'text-gray-400'
                                            }`}>
                                            {tier.percent}%
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Long Term Benefits - Clean Grey */}
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <Star size={12} className="text-amber-500 fill-amber-500" />
                                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Exclusive Rewards</span>
                            </div>
                            <h3 className="text-2xl font-semibold mb-1 tracking-tight text-gray-900 dark:text-white">Long Term Benefits</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">From 2nd Year Onwards</p>
                        </div>

                        <div className="flex items-center justify-center gap-1.5 mb-5">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Base Benefit - Purple (Brand) */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                                <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Base Benefit</p>
                                <p className="text-4xl font-semibold text-blue-600 mb-1 tracking-tight">15%</p>
                                <p className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">3% × 5 referrals</p>
                            </div>
                            {/* Per Referral - Green (Semantic) */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                                <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Per Referral</p>
                                <p className="text-4xl font-semibold text-emerald-600 mb-1 tracking-tight">+5%</p>
                                <p className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">Short term extra</p>
                            </div>
                        </div>

                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-4 text-center font-medium">
                            * Requires minimum 1 referral in the new year to unlock
                        </p>
                    </div>
                </div>

                {/* Next Milestone - Purple (Brand) */}
                <div className="bg-gradient-to-br from-pink-600 to-pink-700 text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <Award size={24} strokeWidth={2} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-0.5 tracking-tight">5-Star Status</h3>
                                <p className="text-sm text-blue-100 font-medium">5 Referrals Required</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-semibold text-blue-100 uppercase tracking-wider mb-1">Progress</p>
                            <p className="text-2xl font-semibold">{userData.confirmedReferralCount}/5</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
