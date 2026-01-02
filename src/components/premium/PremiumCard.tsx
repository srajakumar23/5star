interface PremiumCardProps {
    children: React.ReactNode
    className?: string
    noPadding?: boolean
}

export function PremiumCard({ children, className = "", noPadding = false }: PremiumCardProps) {
    return (
        <div className={`bg-white rounded-[32px] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden ${className}`}>
            <div className={noPadding ? "" : "p-8"}>
                {children}
            </div>
        </div>
    )
}
