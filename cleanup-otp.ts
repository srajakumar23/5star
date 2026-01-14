import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanup() {
    const mobilesToDelete = [
        '8015000009',
        "'8015000009'", // checking for quoted version
        '"8015000009"'  // double quoted
    ]

    console.log('Cleaning up OTPs...')

    for (const m of mobilesToDelete) {
        try {
            const { count } = await prisma.otpVerification.deleteMany({
                where: { mobile: m }
            })
            console.log(`Deleted ${count} records for: ${m}`)
        } catch (e) {
            console.error(`Error deleting ${m}:`, e)
        }
    }
}

cleanup()
