
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Adding demo credentials...')

    // 1. Campus Head
    await prisma.admin.upsert({
        where: { adminMobile: '8888888888' },
        update: {},
        create: {
            adminName: 'Demo Campus Head',
            adminMobile: '8888888888',
            role: 'CampusHead',
            assignedCampus: 'ASM-VILLIANUR(9-12)'
        }
    })

    // 2. Admission Admin
    await prisma.admin.upsert({
        where: { adminMobile: '7777777777' },
        update: {},
        create: {
            adminName: 'Demo Admission Admin',
            adminMobile: '7777777777',
            role: 'Admission Admin'
        }
    })

    console.log('Done!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
