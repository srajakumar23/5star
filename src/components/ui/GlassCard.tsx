interface GlassCardProps {
    children: React.ReactNode
    className?: string
    onClick?: () => void
}

export function GlassCard({ children, className = '', onClick }: GlassCardProps) {
    return (
        <div
            onClick={onClick}
            className={`bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-[24px] text-white shadow-2xl shadow-black/20 relative overflow-hidden group hover:bg-white/15 transition-all ${className}`}
        >
            {/* Top Shine */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50"></div>

            {/* Bottom Shadow Line */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-black/20 to-transparent opacity-50"></div>

            {children}
        </div>
    )
}
