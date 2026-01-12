import { LucideIcon, Edit, Trash2, CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

interface ActionButton {
    icon: LucideIcon
    onClick: (e: React.MouseEvent) => void
    color?: string // text-red-500
    bg?: string // hover:bg-red-50
    label?: string
}

interface MobileCardProps {
    title: string
    subtitle?: string
    status?: string // Active, Inactive
    statusVariant?: 'success' | 'warning' | 'error' | 'default'
    tags?: (string | undefined | null)[]
    avatar?: string | React.ReactNode
    actions?: React.ReactNode
    onClick?: () => void
    className?: string
    details?: { label: string; value: string | number; icon?: LucideIcon }[]
}

export function MobileStatsCard({
    title,
    subtitle,
    status,
    statusVariant = 'default',
    tags = [],
    avatar,
    actions,
    onClick,
    className = "",
    details = []
}: MobileCardProps) {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm active:scale-[0.98] transition-all ${className}`}
        >
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                    {/* Avatar Area */}
                    {avatar && (
                        <div className="shrink-0">
                            {typeof avatar === 'string' ? (
                                <img src={avatar} alt={title} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                            ) : (
                                avatar
                            )}
                        </div>
                    )}

                    {/* Title Area */}
                    <div>
                        <h4 className="font-bold text-gray-900 text-[15px] leading-tight">{title}</h4>
                        {subtitle && <p className="text-xs font-semibold text-gray-500 mt-1">{subtitle}</p>}

                        {/* Tags */}
                        {tags.filter(Boolean).length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {tags.filter(Boolean).map((tag, idx) => (
                                    <span key={idx} className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-md text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Badge */}
                {status && (
                    <Badge variant={statusVariant} className="shrink-0">
                        {status}
                    </Badge>
                )}
            </div>

            {/* Key Value Details */}
            {details.length > 0 && (
                <div className="grid grid-cols-2 gap-3 py-3 border-t border-dashed border-gray-100">
                    {details.map((detail, idx) => (
                        <div key={idx} className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                {detail.icon && <detail.icon size={10} />}
                                {detail.label}
                            </div>
                            <p className="text-xs font-bold text-gray-700 truncate">{detail.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Actions Footer */}
            {actions && (
                <div className="mt-2 pt-3 border-t border-gray-50 flex justify-end gap-2">
                    {actions}
                </div>
            )}
        </div>
    )
}
