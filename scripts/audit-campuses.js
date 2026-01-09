
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    const leads = await prisma.referralLead.groupBy({
        by: ['campus'],
        _count: { _all: true }
    })

    const users = await prisma.user.groupBy({
        by: ['assignedCampus'],
        _count: { _all: true }
    })

    const campuses = await prisma.campus.findMany({
        select: { campusName: true }
    })

    console.log('--- CAMPUS NAMES ---')
    console.log(JSON.stringify(campuses.map(c => c.campusName), null, 2))

    console.log('\n--- LEADS CAMPUS FIELDS ---')
    console.log(JSON.stringify(leads, null, 2))

    console.log('\n--- USERS ASSIGNED CAMPUS FIELDS ---')
    console.log(JSON.stringify(users, null, 2))
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
