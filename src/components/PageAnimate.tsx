'use client'

import { motion, Variants } from 'framer-motion'
import { ReactNode } from 'react'

interface PageAnimateProps {
    children: ReactNode
    className?: string
    stagger?: number
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05
        }
    }
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            mass: 1
        }
    }
}

export function PageAnimate({ children, className = "", stagger = 0.1 }: PageAnimateProps) {
    const variants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: stagger,
                delayChildren: 0.05
            }
        }
    }

    return (
        <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function PageItem({ children, className = "" }: { children: ReactNode, className?: string }) {
    return (
        <motion.div variants={itemVariants} className={className}>
            {children}
        </motion.div>
    )
}
