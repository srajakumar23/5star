
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    // Update Priya Menon
    const updated = await prisma.user.update({
        where: { userId: 228 },
        data: {
            empId: 'EMP-PRIYA-01',
            assignedCampus: 'Achariya World Class Main Campus'
        }
    })
    console.log('Updated Priya:', updated)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
