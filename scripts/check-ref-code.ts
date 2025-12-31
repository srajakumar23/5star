
import prisma from './src/lib/prisma'

async function checkCode() {
    const codeShort = 'ACH25-P5'
    const codeLong = 'ACH25-P00005'

    console.log(`Checking ${codeShort}...`)
    const userShort = await prisma.user.findUnique({ where: { referralCode: codeShort } })
    console.log(`${codeShort} exists:`, !!userShort)

    console.log(`Checking ${codeLong}...`)
    const userLong = await prisma.user.findUnique({ where: { referralCode: codeLong } })
    console.log(`${codeLong} exists:`, !!userLong)
}

checkCode()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
