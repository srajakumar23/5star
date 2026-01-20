
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verify() {
    const newNames = [
        'ABSM - KK NAGAR',
        'ASM HSC - VILLIANUR',
        'ASM - VILLIANUR',
        'AKLAVYA - REDDIYARPALAYAM',
        'ABSM - VARASALAVAKAM',
        'ASM - THAVALAKUPPAM'
    ]

    console.log('🔍 Verifying Campuses...')

    for (const name of newNames) {
        const campus = await prisma.campus.findUnique({ where: { campusName: name } })
        console.log(`- "${name}": ${campus ? '✅ Exists' : '❌ NOT FOUND'}`)

        if (campus) {
            // Check dependent counts (sampling)
            const userCount = await prisma.user.count({ where: { assignedCampus: name } })
            console.log(`  - Users linked: ${userCount}`)
        }
    }
}

verify()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect())
