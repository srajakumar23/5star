
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const userCount = await prisma.user.count()
    const leadCount = await prisma.referralLead.count()
    const studentCount = await prisma.student.count()

    console.log('--- DB STATS ---')
    console.log('Users:', userCount)
    console.log('Leads:', leadCount)
    console.log('Students:', studentCount)

    if (userCount > 0) {
        const sampleUser = await prisma.user.findFirst()
        console.log('Sample User Status:', sampleUser.status)
        console.log('Sample User Role:', sampleUser.role)
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
