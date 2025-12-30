import { ReactNode } from 'react'

interface BadgeProps {
    children: ReactNode
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline' | 'purple'
    className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
    const getBaseClasses = () => "inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors"

    const getVariantClasses = () => {
        switch (variant) {
            case 'success':
                return "bg-emerald-50 text-emerald-600 border border-emerald-100"
            case 'warning':
                return "bg-amber-50 text-amber-600 border border-amber-100"
            case 'error':
                return "bg-red-50 text-red-600 border border-red-100"
            case 'info':
                return "bg-blue-50 text-blue-600 border border-blue-100"
            case 'purple':
                return "bg-purple-50 text-purple-600 border border-purple-100"
            case 'outline':
                return "bg-white text-gray-600 border border-gray-200"
            case 'default':
            default:
                return "bg-gray-100 text-gray-700 border border-transparent"
        }
    }

    return (
        <span className={`${getBaseClasses()} ${getVariantClasses()} ${className}`}>
            {children}
        </span>
    )
}
