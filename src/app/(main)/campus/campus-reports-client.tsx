'use client'

import { Download, FileText, Users, IndianRupee, ArrowRight } from 'lucide-react'
import { generatePDFReport } from '@/lib/pdf-export'
import { toast } from 'sonner'

interface CampusReportsClientProps {
    campusName: string
    students: any[]
    referrals: any[]
    financeData: any[]
    financeSummary: {
        totalConfirmed: number
        totalBenefits: number
    }
}

export function CampusReportsClient({
    campusName,
    students,
    referrals,
    financeData,
    financeSummary
}: CampusReportsClientProps) {

    const handleDownloadStudents = () => {
        if (students.length === 0) {
            toast.error('No student data to export')
            return
        }

        generatePDFReport({
            title: 'Student Roster Report',
            subtitle: `Campus: ${campusName}`,
            fileName: `students_${campusName.replace(/\s/g, '_').toLowerCase()}`,
            columns: [
                { header: 'Name', dataKey: 'fullName' },
                { header: 'Grade', dataKey: 'grade' },
                { header: 'Section', dataKey: 'section' },
                { header: 'Roll No', dataKey: 'rollNumber' },
                { header: 'Parent Name', dataKey: 'parentName' },
                { header: 'Parent Mobile', dataKey: 'parentMobile' }
            ],
            data: students.map(s => ({
                fullName: s.fullName,
                grade: s.grade,
                section: s.section || '-',
                rollNumber: s.rollNumber || '-',
                parentName: s.parent?.fullName || '-',
                parentMobile: s.parent?.mobileNumber || '-'
            }))
        })
        toast.success('Student report downloaded!')
    }

    const handleDownloadReferrals = () => {
        if (referrals.length === 0) {
            toast.error('No referral data to export')
            return
        }

        generatePDFReport({
            title: 'Lead Pipeline Report',
            subtitle: `Campus: ${campusName}`,
            fileName: `leads_${campusName.replace(/\s/g, '_').toLowerCase()}`,
            columns: [
                { header: 'Student Name', dataKey: 'studentName' },
                { header: 'Parent Name', dataKey: 'parentName' },
                { header: 'Mobile', dataKey: 'parentMobile' },
                { header: 'Referred By', dataKey: 'referredBy' },
                { header: 'Status', dataKey: 'leadStatus' },
                { header: 'Date', dataKey: 'createdAt' }
            ],
            data: referrals.map(r => ({
                studentName: r.studentName || '-',
                parentName: r.parentName,
                parentMobile: r.parentMobile,
                referredBy: r.user?.fullName || '-',
                leadStatus: r.leadStatus,
                createdAt: new Date(r.createdAt).toLocaleDateString('en-IN')
            }))
        })
        toast.success('Lead report downloaded!')
    }

    const handleDownloadFinance = () => {
        if (financeData.length === 0) {
            toast.error('No finance data to export')
            return
        }

        generatePDFReport({
            title: 'Finance Report - Campus Incentives',
            subtitle: `Campus: ${campusName} | Total Confirmed: ${financeSummary.totalConfirmed} | Total Benefits: ₹${financeSummary.totalBenefits.toLocaleString()}`,
            fileName: `finance_${campusName.replace(/\s/g, '_').toLowerCase()}`,
            columns: [
                { header: 'Ambassador', dataKey: 'ambassadorName' },
                { header: 'Role', dataKey: 'role' },
                { header: 'Student', dataKey: 'studentName' },
                { header: 'Parent', dataKey: 'parentName' },
                { header: 'Base Fee (₹)', dataKey: 'baseFee' },
                { header: 'Benefit %', dataKey: 'benefitPercent' },
                { header: 'Est. Benefit (₹)', dataKey: 'estimatedBenefit' }
            ],
            data: financeData.map(r => ({
                ...r,
                baseFee: r.baseFee.toLocaleString(),
                estimatedBenefit: r.estimatedBenefit.toLocaleString()
            }))
        })
        toast.success('Finance report downloaded!')
    }

    const reportCards = [
        {
            title: "Student Roster",
            count: `${students.length} Records`,
            desc: "Complete list of currently enrolled students aligned with this campus.",
            icon: Users,
            color: "from-blue-500 to-blue-600",
            bg: "bg-blue-50",
            action: handleDownloadStudents,
            isPrimary: false
        },
        {
            title: "Lead Pipeline",
            count: `${referrals.length} Leads`,
            desc: "Detailed status of all referral leads tracking from submission to admission.",
            icon: FileText,
            color: "from-purple-500 to-purple-600",
            bg: "bg-purple-50",
            action: handleDownloadReferrals,
            isPrimary: false
        },
        {
            title: "Finance & Incentives",
            count: `₹${financeSummary.totalBenefits.toLocaleString()}`,
            subCount: `${financeSummary.totalConfirmed} Confirmed`,
            desc: "Financial breakdown of approved incentives and payout estimations.",
            icon: IndianRupee,
            color: "from-emerald-500 to-emerald-600",
            bg: "bg-emerald-50",
            action: handleDownloadFinance,
            isPrimary: true
        }
    ]

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportCards.map((card, idx) => (
                    <div
                        key={idx}
                        className="group relative bg-white rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
                    >
                        <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <card.icon size={28} className="text-white" />
                                </div>
                                {card.isPrimary && (
                                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                                        Premium
                                    </span>
                                )}
                            </div>

                            <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight">{card.title}</h3>
                            <div className="flex items-center gap-2 mb-3">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.count}</p>
                                {card.subCount && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{card.subCount}</p>
                                    </>
                                )}
                            </div>

                            <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">{card.desc}</p>

                            <button
                                onClick={card.action}
                                className={`w-full px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md ${card.isPrimary
                                        ? 'bg-gray-900 hover:bg-black text-white'
                                        : 'bg-gray-50 hover:bg-white text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Download size={14} />
                                <span>Download Report</span>
                                <ArrowRight size={12} className="opacity-50" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
