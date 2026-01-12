'use client'

import { useState, useEffect } from 'react'
import { Clock, Shield, User, Filter, Calendar, AlertCircle, CheckCircle, Trash2, Edit, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { getUserAuditLogs } from '@/app/audit-actions'

interface UserAuditTimelineProps {
    userId: number
    userName: string
    onClose: () => void
}

export function UserAuditTimeline({ userId, userName, onClose }: UserAuditTimelineProps) {
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filterAction, setFilterAction] = useState('All')
    const [filterModule, setFilterModule] = useState('All')

    useEffect(() => {
        loadAuditLogs()
    }, [userId])

    const loadAuditLogs = async () => {
        setLoading(true)
        try {
            // Fetched via Server Action
            const res = await getUserAuditLogs(userId)
            if (res.success) {
                setLogs(res.logs || [])
            } else {
                toast.error('Failed to load audit logs')
            }
        } catch (error) {
            toast.error('Failed to load audit logs')
        } finally {
            setLoading(false)
        }
    }

    const getActionIcon = (action: string) => {
        switch (action.toUpperCase()) {
            case 'CREATE': return <Plus size={16} className="text-green-600" />
            case 'UPDATE': return <Edit size={16} className="text-blue-600" />
            case 'DELETE': return <Trash2 size={16} className="text-red-600" />
            default: return <Shield size={16} className="text-gray-600" />
        }
    }

    const getActionColor = (action: string) => {
        switch (action.toUpperCase()) {
            case 'CREATE': return 'bg-green-50 border-green-100 text-green-700'
            case 'UPDATE': return 'bg-blue-50 border-blue-100 text-blue-700'
            case 'DELETE': return 'bg-red-50 border-red-100 text-red-700'
            default: return 'bg-gray-50 border-gray-100 text-gray-700'
        }
    }

    const filteredLogs = logs.filter(log => {
        const matchesAction = filterAction === 'All' || log.action === filterAction
        const matchesModule = filterModule === 'All' || log.module === filterModule
        return matchesAction && matchesModule
    })

    const uniqueActions = ['All', ...new Set(logs.map(l => l.action))]
    const uniqueModules = ['All', ...new Set(logs.map(l => l.module))]

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-black">Audit Timeline</h3>
                            <p className="text-white/80 font-medium mt-1">Complete activity history for {userName}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <AlertCircle size={24} />
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-gray-50 p-4 border-b border-gray-100 flex gap-4">
                    <div className="flex-1">
                        <select
                            value={filterAction}
                            onChange={(e) => setFilterAction(e.target.value)}
                            className="w-full p-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            {uniqueActions.map(action => (
                                <option key={action} value={action}>
                                    {action === 'All' ? 'All Actions' : action}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <select
                            value={filterModule}
                            onChange={(e) => setFilterModule(e.target.value)}
                            className="w-full p-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            {uniqueModules.map(module => (
                                <option key={module} value={module}>
                                    {module === 'All' ? 'All Modules' : module}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Timeline */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="text-center py-20">
                            <Filter size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">No audit logs found</p>
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                            <div className="space-y-6">
                                {filteredLogs.map((log, index) => (
                                    <div key={log.id} className="relative pl-16">
                                        {/* Timeline Dot */}
                                        <div className={`absolute left-4 w-5 h-5 rounded-full border-4 border-white ${log.action === 'CREATE' ? 'bg-green-500' :
                                            log.action === 'UPDATE' ? 'bg-blue-500' :
                                                log.action === 'DELETE' ? 'bg-red-500' : 'bg-gray-500'
                                            }`}></div>

                                        {/* Log Card */}
                                        <div className={`rounded-xl border p-4 ${getActionColor(log.action)}`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    {getActionIcon(log.action)}
                                                    <span className="font-bold text-sm uppercase tracking-wider">{log.action}</span>
                                                    <span className="text-xs px-2 py-0.5 bg-white rounded-full font-bold">
                                                        {log.module}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                    <Clock size={12} />
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium">{log.description}</p>

                                            {log.metadata && Object.keys(log.metadata).length > 0 && (
                                                <div className="mt-3 bg-white/50 rounded-lg p-3">
                                                    <p className="text-xs font-bold text-gray-600 mb-1">METADATA:</p>
                                                    <pre className="text-xs font-mono text-gray-700 overflow-x-auto">
                                                        {JSON.stringify(log.metadata, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                        Showing {filteredLogs.length} of {logs.length} logs
                    </p>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
