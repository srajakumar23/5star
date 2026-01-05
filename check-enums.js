
const { PrismaClient, UserRole, AdminRole } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('UserRole.PARENT:', UserRole.PARENT)
    console.log('AdminRole.SUPER_ADMIN:', AdminRole.SUPER_ADMIN)

    const user = await prisma.user.findFirst({
        where: { role: UserRole.PARENT }
    })
    if (user) {
        console.log('User Role from DB:', user.role)
        console.log('Is User Role === "Parent"?', user.role === 'Parent')
        console.log('Is User Role === "PARENT"?', user.role === 'PARENT')
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
