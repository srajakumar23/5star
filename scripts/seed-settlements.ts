
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding Pending Settlements...')

    // 1. Find a suitable user (Staff or Alumni)
    let user = await prisma.user.findFirst({
        where: { role: { in: ['Staff', 'Alumni'] } }
    })

    // If no user, mock one
    if (!user) {
        console.log('No user found, creating mock user...')
        user = await prisma.user.create({
            data: {
                fullName: 'Test Ambassador',
                mobileNumber: '9999988888',
                role: 'Staff',
                referralCode: 'TEST-REF-001',
                bankAccountDetails: 'HDFC0001234 - 501002345678'
            }
        })
    }

    // 2. Create Pending Settlements
    const settlements = [
        { amount: 5000, remarks: 'Referral Commission - Student A' },
        { amount: 2500, remarks: 'Bonus - Monthly Target' },
        { amount: 10000, remarks: 'Referral Commission - Student B' },
    ]

    for (const s of settlements) {
        await prisma.settlement.create({
            data: {
                userId: user.userId,
                amount: s.amount,
                status: 'Pending',
                remarks: s.remarks,
                createdAt: new Date() // Now
            }
        })
    }

    console.log(`✅ Created ${settlements.length} pending settlements for ${user.fullName}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
