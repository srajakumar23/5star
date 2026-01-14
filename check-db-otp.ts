import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkOtp(mobile: string) {
    console.log(`Checking DB OTP for ${mobile}`)

    const record = await prisma.otpVerification.findUnique({
        where: { mobile }
    })

    if (!record) {
        console.log('No record found.')
    } else {
        console.log('Current DB Record:', record)
        console.log('Current Time:', new Date())
        console.log('Is Expired:', new Date() > record.expiresAt)
    }

    await prisma.$disconnect()
}

checkOtp('8015000009')
