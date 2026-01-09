
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const range = await prisma.user.aggregate({
        _min: { createdAt: true },
        _max: { createdAt: true }
    })
    console.log('User createdAt range:', JSON.stringify(range, null, 2))

    const countRecent = await prisma.user.count({
        where: {
            createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
        }
    })
    console.log('Users created in last 30 days:', countRecent)
    console.log('Total Users:', await prisma.user.count())
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
