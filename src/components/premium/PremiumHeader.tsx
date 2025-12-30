import { LucideIcon } from 'lucide-react'

interface PremiumHeaderProps {
    title: string
    subtitle: string
    icon: LucideIcon
    iconColor?: string // Tailwind text color class, e.g., "text-red-600"
    iconBgColor?: string // Tailwind bg color class, e.g., "bg-red-50"
    gradientFrom?: string // Tailwind color class, e.g., "from-red-600"
    gradientTo?: string // Tailwind color class
    children?: React.ReactNode // Right-side actions
}

export function PremiumHeader({
    title,
    subtitle,
    icon: Icon,
    iconColor = "text-gray-700",
    iconBgColor = "bg-gray-50",
    gradientFrom = "from-gray-700",
    gradientTo = "to-gray-900",
    children
}: PremiumHeaderProps) {
    return (
        <div className="bg-white rounded-[32px] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 p-8 flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
            {/* Top Gradient Strip */}
            <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${gradientFrom} via-white/50 ${gradientTo} opacity-90`} />

            <div className="flex items-center gap-5">
                <div className={`p-4 ${iconBgColor} rounded-2xl shadow-inner border border-gray-100 group`}>
                    <Icon size={28} className={`${iconColor} transition-transform group-hover:scale-110 duration-300`} strokeWidth={2} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-1.5 max-w-xl">
                        {title}
                    </h1>
                    <p className="text-sm font-bold text-gray-400 tracking-wide uppercase">
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Action Buttons Area */}
            {children && (
                <div className="flex flex-wrap items-center gap-4">
                    {children}
                </div>
            )}
        </div>
    )
}
