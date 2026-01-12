
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
        bg: 'bg-grad-crimson',
        shadow: 'shadow-[0_20px_40px_-15px_rgba(225,29,72,0.25)]',
        text: 'text-red-50',
        iconBg: 'bg-white/10'
    },
    emerald: {
        bg: 'bg-grad-emerald',
        shadow: 'shadow-[0_20px_40px_-15px_rgba(16,185,129,0.25)]',
        text: 'text-emerald-50',
        iconBg: 'bg-white/10'
    },
    amber: {
        bg: 'bg-grad-amber',
        shadow: 'shadow-[0_20px_40px_-15px_rgba(217,119,6,0.25)]',
        text: 'text-amber-50',
        iconBg: 'bg-white/10'
    },
    orange: {
        bg: 'bg-gradient-to-br from-orange-400 to-orange-600',
        shadow: 'shadow-[0_20px_40px_-15px_rgba(249,115,22,0.25)]',
        text: 'text-orange-50',
        iconBg: 'bg-white/10'
    },
    blue: {
        bg: 'bg-grad-sapphire',
        shadow: 'shadow-[0_20px_40px_-15px_rgba(37,99,235,0.25)]',
        text: 'text-blue-50',
        iconBg: 'bg-white/10'
    },
    gray: {
        bg: 'glass-panel',
        shadow: 'shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)]',
        text: 'text-slate-600 dark:text-slate-300',
        iconBg: 'bg-slate-500/10'
    }
}

export function StatCard({ title, value, icon: Icon, theme, subValue, className = '' }: StatCardProps) {
    const styles = themeStyles[theme]

    return (
        <div className={`${styles.bg} p-6 rounded-[28px] relative overflow-hidden ${styles.shadow} group hover:scale-[1.03] transition-all duration-300 ${className}`}>
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2.5s_infinite] transition-transform" />

            {/* Hover Flare */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-0 left-0 w-24 h-24 bg-white/20 rounded-full blur-2xl -translate-y-1/2 -translate-x-1/2 group-hover:translate-x-[200%] transition-transform duration-1000" />
            </div>

            <div className="absolute right-[-15px] bottom-[-15px] opacity-10 rotate-[-15deg] group-hover:rotate-0 group-hover:scale-110 transition-transform duration-700">
                <Icon size={100} />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className={`flex items-center gap-2 mb-4`}>
                        <div className={`p-2 ${styles.iconBg} rounded-xl backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform`}>
                            <Icon size={18} className={theme === 'gray' ? 'text-ui-primary' : 'text-white'} />
                        </div>
                        <span className={`text-[11px] font-bold uppercase tracking-[0.15em] ${theme === 'gray' ? 'text-slate-500' : 'text-white/80'}`}>{title}</span>
                    </div>

                    <p className={`text-4xl md:text-5xl font-black tracking-tight ${theme === 'gray' ? 'text-ui-text-main' : 'text-white'}`}>
                        {value}
                    </p>

                    {subValue && (
                        <p className={`text-xs font-semibold mt-2 ${theme === 'gray' ? 'text-slate-400' : 'text-white/60'}`}>
                            {subValue}
                        </p>
                    )}
                </div>

                {/* Mock Sparkline Visual */}
                <div className="mt-6 opacity-30 group-hover:opacity-60 transition-opacity h-12 w-full">
                    <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
                        <path
                            d="M0 15 Q 10 5, 20 12 T 40 8 T 60 15 T 80 5 T 100 12"
                            fill="none"
                            stroke={theme === 'gray' ? 'currentColor' : 'white'}
                            strokeWidth="2"
                            className="text-ui-primary"
                        >
                            <animate
                                attributeName="stroke-dasharray"
                                from="0,100"
                                to="100,0"
                                dur="1.5s"
                                repeatCount="1"
                            />
                        </path>
                    </svg>
                </div>
            </div>
        </div>
    )
}
