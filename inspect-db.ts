import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function inspectOTPState() {
    console.log('\n=== OTP Database State ===\n')

    // Get all current OTP records
    const otps = await prisma.otpVerification.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10
    })

    console.log(`Total Active OTP Records: ${otps.length}\n`)

    otps.forEach((otp, index) => {
        const now = new Date()
        const isExpired = now > otp.expiresAt
        const timeLeft = isExpired ? 0 : Math.round((otp.expiresAt.getTime() - now.getTime()) / 1000)

        console.log(`[${index + 1}] Mobile: ${otp.mobile}`)
        console.log(`    OTP: ${otp.otp}`)
        console.log(`    Status: ${isExpired ? '⚠️  EXPIRED' : '✅ VALID'}`)
        console.log(`    Time Left: ${isExpired ? 'N/A' : `${timeLeft}s`}`)
        console.log(`    Created: ${otp.createdAt.toISOString()}`)
        console.log(`    Expires: ${otp.expiresAt.toISOString()}`)
        console.log('')
    })

    // Check for duplicates (shouldn't exist with unique constraint)
    const duplicateCheck = await prisma.otpVerification.groupBy({
        by: ['mobile'],
        _count: { mobile: true },
        having: { mobile: { _count: { gt: 1 } } }
    })

    if (duplicateCheck.length > 0) {
        console.log('⚠️  WARNING: Found duplicate records (should be impossible):')
        duplicateCheck.forEach(d => {
            console.log(`   Mobile ${d.mobile}: ${d._count.mobile} records`)
        })
    } else {
        console.log('✅ No duplicate records (unique constraint working)')
    }

    await prisma.$disconnect()
}

inspectOTPState().catch(console.error)
