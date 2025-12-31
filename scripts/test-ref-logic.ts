
import { sendReferralOtp } from './src/app/referral-actions'
import prisma from './src/lib/prisma'

// Mocking dependencies if needed, but since we are running via ts-node in a context that loads actions might be tricky due to 'use server'
// Instead, let's write a pure script that replicates the logic of sendReferralOtp EXACTLY.

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

    // 2. Mock OTP Send (Replicating sendReferralOtp)
    const existingUser = await prisma.user.findUnique({ where: { mobileNumber: mobile } })
    if (existingUser) { console.log('❌ Mobile is existing user'); return }

    const existingLead = await prisma.referralLead.findFirst({ where: { parentMobile: mobile } })
    if (existingLead) { console.log('❌ Mobile is existing lead'); return }

    console.log('✅ All checks passed. Ready to send OTP.')
}

testLogic()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
