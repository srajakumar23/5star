
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const codes = ['ACH25-P5', 'ACH25-P00005']

    for (const code of codes) {
        const user = await prisma.user.findUnique({
            where: { referralCode: code }
        })
        console.log(`Code '${code}' exists? ${!!user}`)
        if (user) {
            console.log(`  -> User: ${user.fullName} (${user.mobileNumber})`)
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
