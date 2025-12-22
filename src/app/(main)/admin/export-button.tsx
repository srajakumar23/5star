'use client'

export function ExportButton({ data }: { data: any[] }) {
    const downloadCsv = () => {
        const headers = ['LeadID', 'Referrer', 'Role', 'ReferralCode', 'ParentName', 'ParentMobile', 'Campus', 'Grade', 'Status', 'Date']
        const rows = data.map((r: any) => [
            r.leadId,
            r.user.fullName,
            r.user.role,
            r.user.referralCode,
            r.parentName,
            r.parentMobile,
            r.campus,
            r.gradeInterested,
            r.leadStatus,
            r.createdAt
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map((cell: any) => `"${cell || ''}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `referrals_export_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <button onClick={downloadCsv} className="btn btn-outline text-sm py-2 px-4 h-auto">
            Export CSV
        </button>
    )
}
