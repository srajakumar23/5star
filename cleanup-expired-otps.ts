import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanup() {
    console.log('\n=== Cleaning Up Old/Expired OTPs ===\n')

    // Delete all expired OTP records
    const result = await prisma.otpVerification.deleteMany({
        where: {
            expiresAt: {
                lt: new Date()
            }
        }
    })

    console.log(`✅ Deleted ${result.count} expired OTP records`)

    // Show remaining active OTPs
    const remaining = await prisma.otpVerification.findMany()
    console.log(`\n📊 Remaining active OTPs: ${remaining.length}`)

    remaining.forEach(otp => {
        console.log(`   Mobile: ${otp.mobile}, OTP Length: ${otp.otp.length} digits`)
    })

    await prisma.$disconnect()
}

cleanup().catch(console.error)
