
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const sum = await prisma.user.aggregate({
        _sum: { confirmedReferralCount: true },
        _count: { _all: true }
    })
    console.log('Legacy Data Audit:', JSON.stringify(sum, null, 2))

    const campuses = await prisma.user.groupBy({
        by: ['assignedCampus'],
        _sum: { confirmedReferralCount: true },
        _count: { _all: true },
        where: { assignedCampus: { not: null } }
    })
    console.log('Campus Data Audit:', JSON.stringify(campuses, null, 2))
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
