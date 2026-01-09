
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const models = [
        'user', 'student', 'referralLead', 'campus', 'campusTarget',
        'gradeFee', 'marketingAsset', 'notification', 'supportTicket'
    ]

    console.log('--- DB ROW COUNTS ---')
    for (const model of models) {
        try {
            const count = await prisma[model].count()
            console.log(`${model}: ${count}`)
        } catch (e) {
            console.log(`${model}: FELL THROUGH (${e.message})`)
        }
    }

    const userRoles = await prisma.user.groupBy({
        by: ['role'],
        _count: { _all: true }
    })
    console.log('\n--- USER ROLES ---')
    console.log(JSON.stringify(userRoles, null, 2))
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
