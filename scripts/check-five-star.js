
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const stats = await prisma.user.aggregate({
        _count: { _all: true },
        where: { isFiveStarMember: true }
    })
    console.log('Total Five Star Members:', stats._count._all)

    const campusStats = await prisma.user.groupBy({
        by: ['assignedCampus', 'isFiveStarMember'],
        _count: { _all: true },
        where: { assignedCampus: { not: null } }
    })
    console.log('Five Star Stats by Campus:', JSON.stringify(campusStats, null, 2))
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
