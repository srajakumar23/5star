
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const campuses = await prisma.campus.findMany({ take: 5 })
    console.log('--- Campuses ---')
    console.log(campuses.map(c => c.campusName))

    const users = await prisma.user.findMany({ take: 5, where: { role: 'Staff' } })
    console.log('--- Staff Users (Ambassadors) ---')
    console.log(users.map(u => ({ name: u.fullName, mobile: u.mobileNumber })))
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
