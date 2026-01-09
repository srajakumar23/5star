
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    const totalLeads = await prisma.referralLead.count()
    console.log('Total Leads in DB:', totalLeads)

    const leadsById = await prisma.referralLead.groupBy({
        by: ['campusId'],
        _count: { _all: true }
    })
    console.log('Leads by campusId:', JSON.stringify(leadsById, null, 2))

    const leadsByString = await prisma.referralLead.groupBy({
        by: ['campus'],
        _count: { _all: true }
    })
    console.log('Leads by campus string:', JSON.stringify(leadsByString, null, 2))
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
