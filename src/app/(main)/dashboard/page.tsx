import { getCurrentUser } from '@/lib/auth-service'
import { redirect } from 'next/navigation'
import { getMyReferrals, getMyComparisonStats } from '@/app/referral-actions'
import { ActionHome } from '@/components/ActionHome'
import { encryptReferralCode } from '@/lib/crypto'


export default async function DashboardPage() {
    const user = await getCurrentUser()
    if (!user) redirect('/')

    // Admin redirects
    if (user.role === 'Super Admin') redirect('/superadmin')
    if (user.role === 'Finance Admin') redirect('/finance')
    if (user.role.includes('Campus')) redirect('/campus')
    if (user.role.includes('Admin')) redirect('/admin')

    const userData = user as any
    const [referrals] = await Promise.all([
        getMyReferrals(),
    ])

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://5starambassador.com'

    // Encrypt referral code for security
    const encryptedCode = encryptReferralCode(userData.referralCode)

    // Short URL format - cleaner and more secure
    const referralLink = `${baseUrl}/r/${encryptedCode}`
    const shareText = `Hi! I'm part of the Achariya Partnership Program.\nAdmissions link: ${referralLink}`

    // Build WhatsApp URL
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`


    // Get month stats for trends
    const monthStats = await getMyComparisonStats()


    // Prepare recent referrals for ActionHome
    const recentReferrals = referrals.slice(0, 5).map(r => ({
        id: r.leadId,
        parentName: r.parentName,
        status: r.leadStatus,
        createdAt: r.createdAt.toISOString()
    }))

    return (
        <div className="-mx-2 xl:mx-0">
            <ActionHome
                user={{
                    fullName: userData.fullName,
                    role: userData.role,
                    referralCode: userData.referralCode,
                    confirmedReferralCount: userData.confirmedReferralCount || 0,
                    yearFeeBenefitPercent: userData.yearFeeBenefitPercent || 0,
                    benefitStatus: userData.benefitStatus || 'Active',
                    empId: userData.empId,
                    assignedCampus: userData.assignedCampus
                }}
                recentReferrals={recentReferrals}
                whatsappUrl={whatsappUrl}
                monthStats={monthStats}
            />
        </div>
    )
}
