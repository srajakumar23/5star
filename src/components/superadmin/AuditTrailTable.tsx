import { Database, Download } from 'lucide-react'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { exportToCSV } from '@/lib/export-utils'

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
    const columns = [
        {
            header: 'Timestamp',
            accessorKey: 'timestamp',
            sortable: true,
            cell: (log: AuditLog) => (
                <span className="text-sm font-medium text-gray-500 whitespace-nowrap">{log.timestamp}</span>
            )
        },
        {
            header: 'Admin',
            accessorKey: 'admin',
            sortable: true,
            filterable: true,
            cell: (log: AuditLog) => (
                <span className="text-sm font-bold text-gray-900">{log.admin}</span>
            )
        },
        {
            header: 'Action',
            accessorKey: 'action',
            sortable: true,
            filterable: true,
            cell: (log: AuditLog) => (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                    {log.action}
                </span>
            )
        },
        {
            header: 'Details',
            accessorKey: 'details',
            cell: (log: AuditLog) => (
                <span className="text-sm text-gray-600 max-w-md truncate block" title={log.details}>{log.details}</span>
            )
        }
    ]

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-end">
                <button
                    onClick={() => exportToCSV(logs, 'Audit_Logs', [
                        { header: 'Timestamp', accessor: (l) => l.timestamp },
                        { header: 'Admin', accessor: (l) => l.admin },
                        { header: 'Action', accessor: (l) => l.action },
                        { header: 'Details', accessor: (l) => l.details }
                    ])}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
                >
                    <Download size={14} /> Export Logs
                </button>
            </div>
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
                <DataTable
                    data={logs}
                    columns={columns as any}
                    pageSize={10}
                    searchKey={['admin', 'action', 'details']}
                    searchPlaceholder="Search logs..."
                />
            </div>
        </div>
    )
}
