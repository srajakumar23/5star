import { Database } from 'lucide-react'

interface AuditLog {
    timestamp: string
    admin: string
    action: string
    details: string
}

interface AuditTrailTableProps {
    logs: AuditLog[]
}

export function AuditTrailTable({ logs }: AuditTrailTableProps) {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400">Timestamp</th>
                            <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400">Admin</th>
                            <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400">Action</th>
                            <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {logs.length > 0 ? (
                            logs.map((log, i) => (
                                <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-500 whitespace-nowrap">{log.timestamp}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{log.admin}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate" title={log.details}>{log.details}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-4 bg-gray-50 rounded-full text-gray-300">
                                            <Database size={32} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900">No Activity Logs</p>
                                            <p className="text-xs font-medium text-gray-400 mt-1">Actions performed by admins will appear here.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
