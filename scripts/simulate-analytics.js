
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { getPrismaScopeFilter } = require('../src/lib/permissions')

async function main() {
    const user = await prisma.user.findFirst({
        where: { fullName: { contains: 'Rajakumaran' } }
    })

    if (!user) {
        console.log('User not found')
        return
    }

    // Normalize role like auth-service does
    const normalizedUser = {
        ...user,
        role: 'Super Admin' // Hardcoded for simulation
    }

    console.log('Simulating for:', normalizedUser.fullName, normalizedUser.role)

    const scopeFilterUsers = getPrismaScopeFilter(normalizedUser, 'userManagement')
    console.log('Scope Filter Users:', JSON.stringify(scopeFilterUsers, null, 2))

    const totalAmbassadors = await prisma.user.count({ where: { ...scopeFilterUsers } })
    console.log('Total Ambassadors Count with Filter:', totalAmbassadors)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
