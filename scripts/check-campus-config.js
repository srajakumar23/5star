const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🔍 Checking Campus Head Configuration...')

    // List Valid Campuses
    console.log('\n🏫 Valid Campuses in DB:')
    const campuses = await prisma.campus.findMany()
    campuses.forEach(c => {
        console.log(`   - [${c.id}] ${c.campusName} (Code: ${c.campusCode})`)
    })
}

main()
    .finally(() => prisma.$disconnect())
