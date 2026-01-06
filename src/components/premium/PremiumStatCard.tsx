import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface PremiumStatCardProps {
    title: string
    value: number | string
    icon: React.ReactNode
    gradient?: string
    shadowColor?: string
    change?: {
        value: string | number
        isIncrease: boolean
    } | null
    subtext?: string
    colSpan?: number
}

export function PremiumStatCard({
    title,
    value,
    icon,
    gradient = "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)", // Default Blue
    shadowColor = "rgba(59, 130, 246, 0.3)",
    change,
    subtext,
    chart
}: PremiumStatCardProps & { chart?: React.ReactNode }) {
    return (
        <div className="relative overflow-hidden rounded-[32px] p-8 transition-all duration-300 hover:-translate-y-1 group"
            style={{
                background: gradient,
                boxShadow: `0 20px 40px -10px ${shadowColor}`,
            }}>

            {/* Glass Overlay Effects */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-12 -translate-y-12 blur-3xl transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -translate-x-8 translate-y-8 blur-2xl transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner text-white">
                        {icon}
                    </div>
                    {change && (
                        <div className={`flex items-center gap-1 text-xs font-black px-2.5 py-1.5 rounded-full backdrop-blur-md shadow-lg border border-white/20 ${change.isIncrease ? 'bg-emerald-400/20 text-emerald-50' : 'bg-rose-400/20 text-rose-50'}`}>
                            {change.isIncrease ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {change.value}%
                        </div>
                    )}
                </div>

                <div>
                    <p className="text-xs font-black text-white/80 uppercase tracking-[0.2em] mb-2">{title}</p>
                    <h3 className="text-4xl font-black text-white tracking-tighter leading-none shadow-black/10 drop-shadow-sm">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </h3>
                    {subtext && (
                        <p className="text-sm font-medium text-white/70 mt-2">{subtext}</p>
                    )}
                </div>
                {chart && (
                    <div className="mt-4 h-16 w-full opacity-60 hover:opacity-100 transition-opacity">
                        {chart}
                    </div>
                )}
            </div>
        </div>
    )
}
