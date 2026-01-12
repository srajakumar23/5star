'use client'

import { FileDown } from 'lucide-react'
// PDF logic moved to dynamic import inside handleExport to fix Turbopack chunk errors
import { toast } from 'sonner'

interface ExportButtonProps {
    type: 'referrals' | 'users' | 'custom'
    data: any[]
    label?: string
    fileName?: string
    ambassadorName?: string
    title?: string
}

export function ExportButton({
    type,
    data,
    label = 'Export PDF',
    fileName,
    ambassadorName = 'Ambassador',
    title = 'Report'
}: ExportButtonProps) {

    const handleExport = async () => {
        if (data.length === 0) {
            toast.error('No data to export')
            return
        }

        const tid = toast.loading('Preparing PDF...')
        try {
            const { exportReferralsToPDF, exportUsersToPDF, generatePDFReport } = await import('@/lib/pdf-export')

            switch (type) {
                case 'referrals':
                    exportReferralsToPDF(data, ambassadorName)
                    break
                case 'users':
                    exportUsersToPDF(data, title)
                    break
                case 'custom':
                    generatePDFReport({
                        title,
                        fileName: fileName || 'report',
                        columns: Object.keys(data[0]).map(key => ({
                            header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
                            dataKey: key
                        })),
                        data
                    })
                    break
            }
            toast.dismiss(tid)
        } catch (error) {
            console.error('PDF Export Error:', error)
            toast.error('Failed to generate PDF', { id: tid })
        }
    }

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-colors"
        >
            <FileDown size={16} />
            {label}
        </button>
    )
}
