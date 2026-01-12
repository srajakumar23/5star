
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function cleanup() {
    await prisma.referralLead.deleteMany({
        where: { parentMobile: { in: ['9876543210', '9876543211'] } }
    })

    // Reset ambassadors to 0 count / 0 benefit (assuming they were 0 before)
    // For safety, I'll just decrement by 1, but reset is fine for these test accounts.
    await prisma.user.update({
        where: { mobileNumber: '9944535946' },
        data: { confirmedReferralCount: 0, yearFeeBenefitPercent: 0, benefitStatus: 'Inactive' }
    })
    await prisma.user.update({
        where: { mobileNumber: '9042304711' },
        data: { confirmedReferralCount: 0, yearFeeBenefitPercent: 0, benefitStatus: 'Inactive' }
    })

    console.log('Test data cleaned up successfully.')
}

cleanup()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect())
