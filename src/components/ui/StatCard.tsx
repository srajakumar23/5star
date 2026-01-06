
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    theme: 'red' | 'emerald' | 'amber' | 'orange' | 'blue' | 'gray'
    subValue?: string
    className?: string
}

const themeStyles = {
    red: {
        bg: 'bg-gradient-to-br from-red-500 to-rose-600',
        shadow: 'shadow-[0_15px_30px_-10px_rgba(239,68,68,0.3)]',
        text: 'text-red-100'
    },
    emerald: {
        bg: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
        shadow: 'shadow-[0_15px_30px_-10px_rgba(16,185,129,0.3)]',
        text: 'text-emerald-100'
    },
    amber: {
        bg: 'bg-gradient-to-br from-amber-400 to-amber-600',
        shadow: 'shadow-[0_15px_30px_-10px_rgba(245,158,11,0.3)]',
        text: 'text-white'
    },
    orange: {
        bg: 'bg-gradient-to-br from-orange-500 to-orange-600',
        shadow: 'shadow-[0_15px_30px_-10px_rgba(249,115,22,0.3)]',
        text: 'text-white'
    },
    blue: {
        bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
        shadow: 'shadow-[0_15px_30px_-10px_rgba(59,130,246,0.3)]',
        text: 'text-blue-100'
    },
    gray: {
        bg: 'bg-gradient-to-br from-gray-500 to-gray-600',
        shadow: 'shadow-[0_15px_30px_-10px_rgba(75,85,99,0.3)]',
        text: 'text-gray-100'
    }
}

export function StatCard({ title, value, icon: Icon, theme, subValue, className = '' }: StatCardProps) {
    const styles = themeStyles[theme]

    return (
        <div className={`${styles.bg} p-6 rounded-[24px] relative overflow-hidden ${styles.shadow} text-white group hover:scale-[1.02] transition-transform ${className}`}>
            <div className="absolute right-[-10px] bottom-[-10px] opacity-10 rotate-[-10deg] group-hover:rotate-0 transition-transform duration-500">
                <Icon size={80} />
            </div>
            <div className="relative z-10">
                <div className={`flex items-center gap-2 mb-3 ${styles.text}`}>
                    <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                        <Icon size={16} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
                </div>
                <p className="text-4xl font-extrabold tracking-tight">{value}</p>
                {subValue && (
                    <p className={`text-xs font-medium mt-1 opacity-80 ${styles.text}`}>{subValue}</p>
                )}
            </div>
        </div>
    )
}
