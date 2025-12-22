import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const CAMPUSES = [
    "ASM-VILLIANUR(9-12)",
    "ASM-VILLIANUR(MONT-8)",
    "ASM-VILLUPURAM",
    "ASM-ALAPAKKAM",
    "ADYAR",
    "AKLAVYA-RP",
    "KKNAGAR",
    "VALASARAVAKKAM"
]

async function main() {
    console.log('Updating user campus assignments...')

    // Get all users
    const users = await prisma.user.findMany({
        orderBy: { userId: 'asc' }
    })

    let updated = 0

    for (let i = 0; i < users.length; i++) {
        const user = users[i]
        // Assign campus in round-robin fashion
        const campus = CAMPUSES[i % CAMPUSES.length]

        await prisma.user.update({
            where: { userId: user.userId },
            data: { assignedCampus: campus }
        })

        console.log(`Updated ${user.fullName} -> ${campus}`)
        updated++
    }

    console.log(`✓ Updated ${updated} users with campus assignments`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
        console.log('Done!')
    })
    .catch(async (e) => {
        console.error('Error:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
