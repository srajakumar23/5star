
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listAll() {
    console.log('📋 Listing ALL Campuses:')
    const campuses = await prisma.campus.findMany({
        select: { id: true, campusName: true }
    })

    campuses.forEach(c => {
        console.log(`[${c.id}] ${c.campusName}`)
    })
}

listAll()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect())
