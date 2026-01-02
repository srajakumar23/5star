
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany({
        where: { role: { in: ['Parent', 'Staff'] } },
        select: {
            fullName: true,
            role: true,
            academicYear: true,
            studentFee: true,
            confirmedReferralCount: true,
            yearFeeBenefitPercent: true
        }
    })

    const campuses = await prisma.campus.findMany({
        include: { gradeFees: true }
    })

    console.log('\n--- CAMPUS REPORT ---')
    campuses.forEach(c => {
        console.log(`Campus: ${c.campusName} (${c.campusCode})`)
        console.log(`Grade Fees: ${c.gradeFees.map(f => `${f.grade}: ₹${f.annualFee}`).join(', ')}`)
        console.log('---------------------------')
    })
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
