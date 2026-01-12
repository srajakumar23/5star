import { getCurrentUser } from '@/lib/auth-service'
import { redirect } from 'next/navigation'
import ProfileClient from './profile-client'
import { decrypt } from '@/lib/encryption'

export default async function ProfilePage() {
    const user = await getCurrentUser()
    if (!user) redirect('/')

    // Serialize user data for client component
    const isUser = 'userId' in user

    // Decrypt sensitive data if present
    const bankDetails = isUser && (user as any).bankAccountDetails ? decrypt((user as any).bankAccountDetails) : undefined
    const aadhar = isUser && (user as any).aadharNo ? decrypt((user as any).aadharNo) : undefined

    const userData = {
        userId: 'userId' in user ? user.userId : undefined,
        adminId: 'adminId' in user ? user.adminId : undefined,
        fullName: user.fullName,
        mobileNumber: 'mobileNumber' in user ? user.mobileNumber : undefined,
        adminMobile: 'adminMobile' in user ? (user as any).adminMobile : undefined,
        role: user.role,
        referralCode: 'referralCode' in user ? user.referralCode : undefined,
        assignedCampus: 'assignedCampus' in user ? (user.assignedCampus ?? undefined) : undefined,
        yearFeeBenefitPercent: 'yearFeeBenefitPercent' in user ? user.yearFeeBenefitPercent : undefined,
        longTermBenefitPercent: 'longTermBenefitPercent' in user ? user.longTermBenefitPercent : undefined,
        email: user.email ?? undefined,
        address: user.address ?? undefined,
        profileImage: user.profileImage ?? undefined,
        createdAt: user.createdAt.toISOString(),
        // New Registration Fields
        bankAccountDetails: bankDetails,
        childName: isUser ? (user as any).childName : undefined,
        grade: isUser ? (user as any).grade : undefined,
        childEprNo: isUser ? (user as any).childEprNo : undefined,
        empId: isUser ? (user as any).empId : undefined,
        aadharNo: aadhar,
        transactionId: isUser ? (user as any).transactionId : undefined
    }

    return <ProfileClient user={userData} />
}
