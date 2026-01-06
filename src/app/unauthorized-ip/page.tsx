import Link from 'next/link'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export default function UnauthorizedIPPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[32px] shadow-2xl border border-red-100 p-12 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-50/50">
                    <ShieldAlert size={48} className="text-red-600" />
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Access Restricted</h1>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Your IP address is not authorized to access the Super Admin portal.
                        Please contact the system administrator from a whitelisted network.
                    </p>
                </div>

                <div className="pt-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all hover:shadow-xl active:scale-95"
                    >
                        <ArrowLeft size={18} />
                        Return to Dashboard
                    </Link>
                </div>

                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                    Internal Security Protocol 403-IP
                </p>
            </div>
        </div>
    )
}
