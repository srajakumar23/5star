'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { ReactNode } from 'react'

interface ConfirmDialogProps {
    isOpen: boolean
    title: string
    description: ReactNode
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'info'
    onConfirm: () => void
    onCancel: () => void
    isLoading?: boolean
}

export function ConfirmDialog({
    isOpen,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    onConfirm,
    onCancel,
    isLoading = false
}: ConfirmDialogProps) {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white/90 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-white/20 backdrop-filter backdrop-blur-xl relative"
                        >
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-full flex-shrink-0 ${variant === 'danger' ? 'bg-red-100 text-red-600' :
                                            variant === 'warning' ? 'bg-amber-100 text-amber-600' :
                                                'bg-blue-100 text-blue-600'
                                        }`}>
                                        <AlertTriangle size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 leading-6 mb-2">
                                            {title}
                                        </h3>
                                        <div className="text-sm text-gray-600 leading-relaxed">
                                            {description}
                                        </div>
                                    </div>
                                    <button
                                        onClick={onCancel}
                                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="mt-8 flex justify-end gap-3">
                                    <button
                                        onClick={onCancel}
                                        disabled={isLoading}
                                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        onClick={onConfirm}
                                        disabled={isLoading}
                                        className={`px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variant === 'danger' ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-red-500/20' :
                                                variant === 'warning' ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 shadow-amber-500/20' :
                                                    'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-blue-500/20'
                                            }`}
                                    >
                                        {isLoading ? 'Processing...' : confirmText}
                                    </button>
                                </div>
                            </div>

                            {/* Decorative Top Border */}
                            <div className={`h-1 w-full ${variant === 'danger' ? 'bg-red-500' :
                                    variant === 'warning' ? 'bg-amber-500' :
                                        'bg-blue-500'
                                }`} />
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
