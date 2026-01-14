
// Mock Next.js stuff
process.env.DATABASE_URL = "postgresql://neondb_owner:npg_yLR5MHPuV9oA@ep-patient-art-a1v3932a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

// DIRECT DATABASE TESTING
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function runTest() {
    const mobile = '9999999999'
    console.log(`\n--- STARTING SIMULATION FOR ${mobile} ---`)

    // 1. Cleanup
    try {
        await prisma.otpVerification.deleteMany({ where: { mobile } })
        console.log('1. Cleaned up DB')
    } catch (e) {
        console.log('1. Cleanup skipped (empty)')
    }

    // 2. Simulate Send OTP #1 (Logic: Find -> Create)
    console.log('\n2. Simulating Send OTP #1...')

    const res1 = await prisma.$transaction(async (tx) => {
        const existing = await tx.otpVerification.findUnique({ where: { mobile } })

        // Logic: Reuse if valid
        if (existing && existing.expiresAt > new Date()) return existing.otp

        // Logic: Create New
        const newOtp = Math.floor(1000 + Math.random() * 9000).toString()
        if (existing) await tx.otpVerification.delete({ where: { mobile } })

        await tx.otpVerification.create({
            data: { mobile, otp: newOtp, expiresAt: new Date(Date.now() + 3 * 60 * 1000) }
        })
        return newOtp
    })

    console.log(`   Generated: ${res1}`)

    const db1 = await prisma.otpVerification.findUnique({ where: { mobile } })
    console.log(`   DB State: ${db1?.otp}`)

    // 3. Simulate Send OTP #2 (Sticky Logic)
    console.log('\n3. Simulating Send OTP #2 (Sticky)...')
    const res2 = await prisma.$transaction(async (tx) => {
        const existing = await tx.otpVerification.findUnique({ where: { mobile } })
        // Logic: Reuse if valid
        if (existing && existing.expiresAt > new Date()) {
            console.log('   (Logic found existing valid OTP)')
            return existing.otp
        }
        return 'FAIL_SHOULD_BE_STICKY'
    })
    console.log(`   Result: ${res2}`)

    if (res1 !== res2) console.error('❌ FAILURE: Sticky Logic broken! Code changed without expiry.')
    else console.log('✅ SUCCESS: Sticky Logic works (Code persisted)')

    // 4. Verification Check (Clean Input)
    console.log('\n4. Verifying CLEAN Input...')
    const cleanInput = mobile
    const sanitizedClean = cleanInput.replace(/\D/g, '')
    const verify1 = await prisma.otpVerification.findUnique({ where: { mobile: sanitizedClean } })

    if (verify1 && verify1.otp === res1) console.log('✅ CLEAN Verification Passed')
    else console.error('❌ CLEAN Verification Failed')

    // 5. Verification Check (Dirty Input - The Fix)
    console.log('\n5. Verifying DIRTY Input ("+91 9999999999 ")...')
    const dirtyInput = "+91 9999999999 "
    const sanitizedDirty = dirtyInput.replace(/\D/g, '')
    console.log(`   Sanitized Input: '${sanitizedDirty}'`)

    if (sanitizedDirty !== mobile) {
        console.error(`❌ SANITIZATION FAIL: Expected '${mobile}', Got '${sanitizedDirty}'`)
    } else {
        const verify2 = await prisma.otpVerification.findUnique({ where: { mobile: sanitizedDirty } })
        if (verify2 && verify2.otp === res1) console.log('✅ DIRTY Verification Passed (Fix Verified)')
        else console.error('❌ DIRTY Verification Failed (DB lookup failed)')
    }

    console.log('\n--- SIMULATION COMPLETE ---')
}

runTest()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
