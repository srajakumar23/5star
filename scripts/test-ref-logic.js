
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testLogic() {
    const mobile = '9999999991' // Dummy mobile
    const referralCode = 'ACH25-P5'

    console.log(`Testing Referral Logic for Code: ${referralCode}`)

    // 1. Ambassador Check
    const ambassador = await prisma.user.findUnique({
        where: { referralCode }
    })

    if (!ambassador) {
        console.error('❌ Ambassador NOT FOUND')
        return
    }
    console.log('✅ Ambassador found:', ambassador.fullName, ambassador.role)

    // 2. Mock OTP Send (Simulating checks in sendReferralOtp)
    const existingUser = await prisma.user.findUnique({ where: { mobileNumber: mobile } })
    if (existingUser) { console.log('❌ Mobile is existing user'); return }

    const existingLead = await prisma.referralLead.findFirst({ where: { parentMobile: mobile } })
    if (existingLead) { console.log('❌ Mobile is existing lead'); return }

    // 3. Simulate OTP Create
    console.log('✅ All checks passed. OTP would be generated here.')
}

testLogic()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect()
    })
