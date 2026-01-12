import { Trash, Plus, Disc, Save, Edit, Award, Download } from 'lucide-react'
import { BenefitSlab } from '@/types'
import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { exportToCSV } from '@/lib/export-utils'

interface BenefitSlabTableProps {
    slabs: BenefitSlab[]
    onAddSlab: () => void
    onEditSlab: (slab: BenefitSlab) => void
    onDeleteSlab: (id: number) => void // slabId
}

export function BenefitSlabTable({ slabs, onAddSlab, onEditSlab, onDeleteSlab }: BenefitSlabTableProps) {

    const columns = [
        {
            header: 'Tier Name',
            accessorKey: 'tierName',
            sortable: true,
            filterable: true,
            cell: (slab: BenefitSlab) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Award size={16} />
                        </div>
                        <span className="text-sm font-black text-gray-900">{slab.tierName || 'Unnamed Tier'}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold ml-11">#ID-{slab.slabId}</span>
                </div>
            )
        },
        {
            header: 'Referrals Needed',
            accessorKey: 'referralCount',
            sortable: true,
            cell: (slab: BenefitSlab) => (
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                    <span className="text-sm font-black text-gray-700">{slab.referralCount} Referrals</span>
                </div>
            )
        },
        {
            header: 'Standard Benefit',
            accessorKey: 'yearFeeBenefitPercent',
            sortable: true,
            cell: (slab: BenefitSlab) => (
                <div className="inline-flex items-center px-4 py-1.5 rounded-xl text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm uppercase tracking-wider">
                    {slab.yearFeeBenefitPercent}% Fee Off
                </div>
            )
        },
        {
            header: 'Long Term Bonus',
            accessorKey: 'longTermExtraPercent',
            cell: (slab: BenefitSlab) => (
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-purple-700">+{slab.longTermExtraPercent}% Extra</span>
                    <span className="text-[10px] text-gray-400">Base: {slab.baseLongTermPercent}%</span>
                </div>
            )
        },
        {
            header: 'Actions',
            accessorKey: (slab: BenefitSlab) => slab.slabId,
            cell: (slab: BenefitSlab) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => onEditSlab(slab)}
                        className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => onDeleteSlab(slab.slabId)}
                        className="p-3 text-red-400 hover:text-white hover:bg-[#CC0000] rounded-xl transition-all shadow-sm hover:shadow-red-200"
                    >
                        <Trash size={18} />
                    </button>
                </div>
            )
        }
    ]

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden premium-border animate-fade-in">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center background: 'linear-gradient(to right, #ffffff, #f9fafb)'">
                <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Benefit Tiers</h3>
                    <p className="text-sm font-medium text-gray-400 mt-1">Define referral milestones and associated fee benefits.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => exportToCSV(slabs, 'Benefit_Tiers', [
                            { header: 'Tier Name', accessor: (s) => s.tierName },
                            { header: 'Min Referrals', accessor: (s) => s.referralCount },
                            { header: 'Discount %', accessor: (s) => s.yearFeeBenefitPercent },
                            { header: 'Bonus %', accessor: (s) => s.longTermExtraPercent }
                        ])}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                    >
                        <Download size={18} /> Export
                    </button>
                    <button
                        onClick={onAddSlab}
                        className="px-4 py-2 bg-gradient-to-r from-[#CC0000] to-[#EF4444] text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <Plus size={18} /> Add Tier
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto pb-4">
                <DataTable
                    data={slabs}
                    columns={columns as any}
                    pageSize={100} // Show all by default
                    searchKey="tierName"
                    searchPlaceholder="Search tiers..."
                />
            </div>
        </div>
    )
}
