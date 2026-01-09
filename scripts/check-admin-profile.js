
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const rajan = await prisma.user.findFirst({
        where: { fullName: { contains: 'Rajakumaran' } }
    })
    console.log('User Rajakumaran Profile:', JSON.stringify(rajan, null, 2))

    const allAdmins = await prisma.admin.findMany()
    console.log('All Admin table entries:', JSON.stringify(allAdmins, null, 2))
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
