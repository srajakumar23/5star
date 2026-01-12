
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function check() {
    const leads = await prisma.referralLead.findMany({
        where: { parentMobile: { in: ['9876543210', '9876543211'] } },
        include: { user: true }
    })
    console.log('--- Imported Leads ---')
    leads.forEach(l => {
        console.log(`${l.parentName} (${l.parentMobile}) - Status: ${l.leadStatus} - ambassador: ${l.user.fullName}`)
    })

    const users = await prisma.user.findMany({
        where: { mobileNumber: { in: ['9944535946', '9042304711'] } }
    })
    console.log('--- Updated Ambassadors ---')
    users.forEach(u => {
        console.log(`${u.fullName} - Confirmed Count: ${u.confirmedReferralCount} - Benefit: ${u.yearFeeBenefitPercent}%`)
    })
}

check()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect())
