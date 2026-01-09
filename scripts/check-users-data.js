
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const usersWithCounts = await prisma.user.findMany({
        where: {
            OR: [
                { confirmedReferralCount: { gt: 0 } },
                { referrals: { some: {} } }
            ]
        },
        select: {
            userId: true,
            fullName: true,
            confirmedReferralCount: true,
            assignedCampus: true,
            _count: {
                select: { referrals: true }
            }
        }
    })

    console.log('--- USERS WITH DATA ---')
    console.log(JSON.stringify(usersWithCounts, null, 2))
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
