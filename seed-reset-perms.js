
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🔄 Resetting Role Permissions to defaults...')

    // Roles to reset
    const rolesToReset = ['CampusHead', 'Admission Admin', 'Campus Admin']

    for (const role of rolesToReset) {
        await prisma.rolePermissions.deleteMany({
            where: { role }
        })
        console.log(`✅ Cleared DB permissions for: ${role} (will use code defaults)`)
    }

    console.log('🎉 Permissions reset complete!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
