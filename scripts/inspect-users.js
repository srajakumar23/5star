
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany({ take: 3 })
    console.log('User Records:', JSON.stringify(users, null, 2))
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
