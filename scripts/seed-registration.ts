
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding Registration Transaction...')

    // Create a dummy user who "paid"
    const user = await prisma.user.create({
        data: {
            fullName: 'New Student Parent',
            mobileNumber: '8888877777', // Dummy
            role: 'Parent',
            childInAchariya: false, // Required field
            referralCode: 'ACH25-P_PAID_001',
            paymentAmount: 1000,
            paymentStatus: 'Completed',
            transactionId: 'PAY_REG_123456789', // Simulating Razorpay/Gateway ID
            academicYear: '2025-2026',
            assignedCampus: 'Main Campus'
        }
    })

    console.log(`✅ Created paid user: ${user.fullName} with Transaction ID: ${user.transactionId}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
