'use client'

import { Trophy, Medal, Star } from 'lucide-react'
import { User } from '@/types'
import { calculateStars } from '@/lib/gamification'

interface LeaderboardWidgetProps {
    users: User[]
}

export function LeaderboardWidget({ users }: LeaderboardWidgetProps) {
    const topUsers = [...users]
        .sort((a, b) => (b.confirmedReferralCount || 0) - (a.confirmedReferralCount || 0))
        .slice(0, 5)

    return (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm overflow-hidden relative">
            <div className="flex justify-between items-end mb-6 relative z-10">
                <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        <Trophy className="text-amber-500" size={24} />
                        Top Ambassadors
                    </h3>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Global Leaderboard</p>
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                {topUsers.map((user, index) => {
                    const stars = calculateStars(user.confirmedReferralCount || 0)
                    const isTop = index === 0

                    return (
                        <div key={user.userId} className="flex items-center gap-4 group">
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center font-black text-sm
                                ${index === 0 ? 'bg-amber-100 text-amber-700' :
                                    index === 1 ? 'bg-slate-100 text-slate-600' :
                                        index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'}
                            `}>
                                {index + 1}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-gray-900 text-sm">{user.fullName}</p>
                                    <div className="flex items-center gap-0.5" title={stars.tier}>
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill={i < stars.starCount ? "currentColor" : "none"}
                                                stroke="currentColor"
                                                className={`w-2.5 h-2.5 ${i < stars.starCount ? (stars.tier === '5-Star' ? 'text-red-500' : 'text-amber-400') : 'text-gray-200 stroke-1'}`}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={i < stars.starCount ? 0 : 1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-xs text-gray-500 font-medium">{user.assignedCampus || 'Global'}</p>
                                    <div className="flex items-center gap-1">
                                        <Star size={10} className="text-amber-400 fill-amber-400" />
                                        <span className="text-xs font-bold text-gray-700">{user.confirmedReferralCount} Points</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
        </div>
    )
}
