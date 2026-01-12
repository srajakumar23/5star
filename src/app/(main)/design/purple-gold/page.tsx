import { getCurrentUser } from '@/lib/auth-service'
import { redirect } from 'next/navigation'
import { getMyReferrals, getMyComparisonStats } from '@/app/referral-actions'
import { ActionHomePurple } from '@/components/themes/ActionHomePurple'
import { encryptReferralCode } from '@/lib/crypto'

export default async function PurpleGoldDashboardPage() {
    const user = await getCurrentUser()
    if (!user) redirect('/')

    if (user.role === 'Super Admin') redirect('/superadmin')
    if (user.role.includes('Campus')) redirect('/campus')
    if (user.role.includes('Admin')) redirect('/admin')

    const userData = user as any
    const [referrals] = await Promise.all([
        getMyReferrals(),
    ])

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://5starambassador.com'
    const encryptedCode = encryptReferralCode(userData.referralCode)
    const referralLink = `${baseUrl}/r/${encryptedCode}`
    const shareText = `Hi! I'm part of the Achariya Partnership Program.\\nAdmissions link: ${referralLink}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
    const monthStats = await getMyComparisonStats()

    const recentReferrals = referrals.slice(0, 5).map(r => ({
        id: r.leadId,
        parentName: r.parentName,
        status: r.leadStatus,
        createdAt: r.createdAt.toISOString()
    }))

    return (
        <ActionHomePurple
            user={{
                fullName: userData.fullName,
                role: userData.role,
                referralCode: userData.referralCode,
                confirmedReferralCount: userData.confirmedReferralCount || 0,
                yearFeeBenefitPercent: userData.yearFeeBenefitPercent || 0,
                benefitStatus: userData.benefitStatus || 'Active',
                empId: userData.empId,
                assignedCampus: userData.assignedCampus,
                academicYear: userData.academicYear
            }}
            recentReferrals={recentReferrals}
            whatsappUrl={whatsappUrl}
            monthStats={monthStats}
        />
    )
}
