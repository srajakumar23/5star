import { getCurrentUser } from '@/lib/auth-service'
import { redirect } from 'next/navigation'
import { PremiumHeader } from '@/components/premium/PremiumHeader'
import { PremiumStatCard } from '@/components/premium/PremiumStatCard'
import { getSettlements, getFinanceStats, getRegistrationTransactions } from '@/app/finance-actions'
import { Wallet, CheckCircle, Clock, CreditCard } from 'lucide-react'
import { FinanceClientTabs } from '@/components/finance/FinanceClientTabs'

export default async function FinancePage() {
    const user = await getCurrentUser()
    if (!user) redirect('/')

    // RBAC: Only Finance Admin, Super Admin, Campus Head
    const allowedRoles = ['Super Admin', 'Finance Admin', 'Campus Head']
    // Campus Admin might be allowed? Let's stick to stricter list for now.
    if (!allowedRoles.some(r => user.role.includes(r)) && user.role !== 'Finance Admin') {
        redirect('/dashboard') // or 403
    }

    // Fetch Data
    const [settlementsRes, statsRes, registrationsRes] = await Promise.all([
        getSettlements('All'),
        getFinanceStats(),
        getRegistrationTransactions('All')
    ])

    const settlements = (settlementsRes.success && settlementsRes.data) ? settlementsRes.data : []
    const registrations = (registrationsRes.success && registrationsRes.data) ? registrationsRes.data : []
    const stats: any = statsRes.success ? statsRes.stats : { pending: 0, processed: 0, totalCount: 0, totalRevenue: 0 }

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <PremiumHeader
                title="Finance & Settlements"
                subtitle="Manage ambassador commissions and payouts"
                icon={Wallet}
                gradientFrom="from-emerald-700"
                gradientTo="to-emerald-900"
                iconBgColor="bg-emerald-50"
                iconColor="text-emerald-700"
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Revenue Card (New) */}
                <PremiumStatCard
                    title="Total Revenue"
                    value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}
                    icon={<CreditCard size={24} />}
                    subtext="Incoming Fees"
                    gradient="linear-gradient(135deg, #059669 0%, #047857 100%)" // Deep Green
                    shadowColor="rgba(5, 150, 105, 0.3)"
                />

                <PremiumStatCard
                    title="Pending Payouts"
                    value={`₹${stats?.pending?.toLocaleString() ?? 0}`}
                    icon={<Clock size={24} />}
                    subtext="Requires Action"
                    gradient="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" // Amber
                    shadowColor="rgba(245, 158, 11, 0.3)"
                />
                <PremiumStatCard
                    title="Processed (Total)"
                    value={`₹${stats?.processed?.toLocaleString() ?? 0}`}
                    icon={<CheckCircle size={24} />}
                    subtext="Lifetime Disbursed"
                    gradient="linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"
                    shadowColor="rgba(59, 130, 246, 0.3)"
                />
                <PremiumStatCard
                    title="Transactions"
                    value={stats?.totalCount ?? 0}
                    icon={<Wallet size={24} />}
                    subtext="Total Volume"
                // Neutral
                />
            </div>

            {/* Main Content with Tabs */}
            {/* Using a simple custom tab implementation since I cannot be sure ui/tabs exists in this project structure logic */}
            {/* Actually, let's stick to a client component wrapper or just use searchParams? */}
            {/* For simplicity and speed, I will use a simple Client Component wrapper for the tabs part if needed, 
                BUT since this is a Server Component page, I'll pass the data to a client-side 'FinanceTabs' component
                OR just inline the tabs logic using searchParams if I want server rendering for tabs. 
                
                BETTER: Let's make a 'FinanceTabs' client component that holds the state.
            */}

            <FinanceClientTabs
                settlements={settlements}
                registrations={registrations}
            />
        </div>
    )
}
