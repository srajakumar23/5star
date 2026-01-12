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
                return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
            case 'warning':
                return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
            case 'error':
                return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
            case 'info':
                return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
            case 'purple':
                return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
            case 'outline':
                return "bg-transparent text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
            case 'default':
            default:
                return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent"
        }
    }

    return (
        <span className={`${getBaseClasses()} ${getVariantClasses()} ${className}`}>
            {children}
        </span>
    )
}
