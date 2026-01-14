import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clean() {
    const mobile = '8015000009'
    console.log(`Cleaning DB for ${mobile}...`)

    try {
        const deleted = await prisma.otpVerification.deleteMany({
            where: { mobile: mobile }
        })
        console.log(`Deleted ${deleted.count} records.`)

        const rateLimits = await prisma.rateLimit.deleteMany({
            where: { key: `otp:${mobile}` }
        })
        console.log(`Deleted ${rateLimits.count} rate limit records.`)

    } catch (e) {
        console.error('Error cleaning:', e)
    } finally {
        await prisma.$disconnect()
    }
}

clean()
