
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log("Fetching users with exact query from superadmin-actions...")

    const users = await prisma.user.findMany({
        select: {
            userId: true,
            fullName: true,
            role: true,
            assignedCampus: true,
            empId: true,
            campusId: true
        },
        orderBy: { createdAt: 'desc' },
        take: 5 // Just check top 5
    })

    console.log(`Found ${users.length} users.`)
    users.forEach(u => {
        console.log(`ID: ${u.userId} | Name: ${u.fullName} | Role: ${u.role} | EMP: ${u.empId} | CampusName: ${u.assignedCampus} | CampusID: ${u.campusId}`)
    })
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
