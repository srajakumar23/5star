
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany({
        where: {
            fullName: {
                contains: 'Priya',
                mode: 'insensitive'
            }
        }
    })

    console.log(`Found ${users.length} users matching 'Priya':`)
    users.forEach(u => {
        console.log(`ID: ${u.userId}, Name: ${u.fullName}, Role: '${u.role}', EMP: ${u.empId}, Campus: ${u.assignedCampus}`)
    })

    const staff = await prisma.user.findFirst({
        where: { role: 'Staff' }
    })
    if (staff) {
        console.log('\nSample Staff User:')
        console.log(`ID: ${staff.userId}, Name: ${staff.fullName}, Role: '${staff.role}', EMP: ${staff.empId}, Campus: ${staff.assignedCampus}`)
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
