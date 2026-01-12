import { Star } from 'lucide-react'
import { ReactNode } from 'react'

interface CircularProgressProps {
    value: number
    max?: number
    size?: number
    strokeWidth?: number
    color?: string
    trackColor?: string
    children?: ReactNode
}

export function CircularProgress({
    value,
    max = 5,
    size = 80,
    strokeWidth = 8,
    color = "text-white",
    children
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const progress = Math.min(value / max, 1)
    const dashoffset = circumference - progress * circumference

    return (
        <div className="relative flex items-center justify-center p-2">
            <svg width={size} height={size} className="rotate-[-90deg]">
                {/* Background Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-white/10"
                />
                {/* Progress Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashoffset}
                    strokeLinecap="round"
                    className={`${color} transition-all duration-1000 ease-out`}
                />
            </svg>
            {/* Center Content */}
            <div className="absolute inset-0 flex items-center justify-center">
                {children ? children : (
                    value >= max ? (
                        <Star size={size * 0.4} fill="currentColor" className="text-amber-300 animate-pulse-slow" />
                    ) : (
                        <span className="text-white font-black tracking-tight" style={{ fontSize: size * 0.25 }}>
                            {value}/{max}
                        </span>
                    )
                )}
            </div>
        </div>
    )
}
