'use client'

import { cn } from '@/lib/utils'

interface PremiumSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'card' | 'text' | 'circle' | 'rectangle'
    width?: string | number
    height?: string | number
}

export function PremiumSkeleton({
    className,
    variant = 'rectangle',
    width,
    height,
    style,
    ...props
}: PremiumSkeletonProps) {
    const getVariantClasses = () => {
        switch (variant) {
            case 'card':
                return 'rounded-[32px]'
            case 'circle':
                return 'rounded-full'
            case 'text':
                return 'rounded-lg'
            case 'rectangle':
            default:
                return 'rounded-2xl'
        }
    }

    return (
        <div
            className={cn(
                'animate-pulse bg-gray-200/80 relative overflow-hidden',
                getVariantClasses(),
                className
            )}
            style={{
                width: width,
                height: height,
                ...style
            }}
            {...props}
        >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
    )
}

/**
 * Pre-built Skeleton layouts for common patterns
 */
export const PremiumSkeletonCard = () => (
    <div className="p-6 rounded-[32px] border border-gray-100 bg-white space-y-4">
        <div className="flex items-center gap-4">
            <PremiumSkeleton variant="circle" width={48} height={48} />
            <div className="space-y-2">
                <PremiumSkeleton variant="text" width={120} height={20} />
                <PremiumSkeleton variant="text" width={80} height={16} />
            </div>
        </div>
        <PremiumSkeleton variant="rectangle" width="100%" height={100} className="rounded-2xl" />
        <div className="flex justify-between items-center pt-2">
            <PremiumSkeleton variant="text" width={60} height={20} />
            <PremiumSkeleton variant="text" width={40} height={20} />
        </div>
    </div>
)

export const PremiumSkeletonTable = ({ rows = 5 }: { rows?: number }) => (
    <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
            <PremiumSkeleton variant="rectangle" width={200} height={40} className="rounded-xl" />
            <PremiumSkeleton variant="rectangle" width={120} height={40} className="rounded-xl" />
        </div>
        <div className="bg-white rounded-[32px] border border-gray-100 p-6 space-y-6">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                    <PremiumSkeleton variant="circle" width={40} height={40} />
                    <PremiumSkeleton variant="text" width="30%" height={24} />
                    <PremiumSkeleton variant="text" width="20%" height={24} />
                    <PremiumSkeleton variant="text" width="20%" height={24} />
                    <PremiumSkeleton variant="rectangle" width={80} height={32} />
                </div>
            ))}
        </div>
    </div>
)
