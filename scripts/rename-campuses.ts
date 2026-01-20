
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mapping: Old Name -> New Name
const campusMappings = [
    { oldName: 'KKNAGAR', newName: 'ABSM - KK NAGAR' },
    { oldName: 'ASM-Villianur(9-12)', newName: 'ASM HSC - VILLIANUR' },
    { oldName: 'ASM-Villianur(Mont-8)', newName: 'ASM - VILLIANUR' },
    { oldName: 'AKLAVYA-RP', newName: 'AKLAVYA - REDDIYARPALAYAM' },
    { oldName: 'Valasaravakkam', newName: 'ABSM - VARASALAVAKAM' },
    { oldName: 'ASM-TKM', newName: 'ASM - THAVALAKUPPAM' },
]

async function main() {
    console.log('🚀 Starting Campus Renaming Process...')

    for (const mapping of campusMappings) {
        const { oldName, newName } = mapping
        console.log(`\n------------------------------------------------`)
        console.log(`Processing: "${oldName}" -> "${newName}"`)

        try {
            // 1. Check if the campus exists
            const existingCampus = await prisma.campus.findUnique({
                where: { campusName: oldName },
            })

            if (!existingCampus) {
                console.warn(`⚠️ Campus "${oldName}" not found in database. Skipping...`)
                continue
            }

            console.log(`✅ Found Campus ID: ${existingCampus.id}`)

            // 2. Perform updates in a transaction to ensure consistency
            const results = await prisma.$transaction(async (tx) => {
                // Step A: Update the Master Campus Record
                const updatedCampus = await tx.campus.update({
                    where: { id: existingCampus.id },
                    data: { campusName: newName },
                })

                // Step B: Update References in other tables

                // 1. Users (Ambassadors/Parents) in 'assignedCampus' (String column)
                const updatedUsers = await tx.user.updateMany({
                    where: { assignedCampus: oldName },
                    data: { assignedCampus: newName },
                })

                // 2. Admins in 'assignedCampus' (String column)
                const updatedAdmins = await tx.admin.updateMany({
                    where: { assignedCampus: oldName },
                    data: { assignedCampus: newName },
                })

                // 3. Referral Leads in 'campus' (String column)
                const updatedLeads = await tx.referralLead.updateMany({
                    where: { campus: oldName },
                    data: { campus: newName },
                })

                // 4. Support Tickets in 'campus' (String column)
                const updatedTickets = await tx.supportTicket.updateMany({
                    where: { campus: oldName },
                    data: { campus: newName },
                })

                return { updatedCampus, updatedUsers, updatedAdmins, updatedLeads, updatedTickets }
            })

            console.log(`🎉 Successfully renamed to "${results.updatedCampus.campusName}"`)
            console.log(`   - Updated ${results.updatedUsers.count} Users`)
            console.log(`   - Updated ${results.updatedAdmins.count} Admins`)
            console.log(`   - Updated ${results.updatedLeads.count} Referral Leads`)
            console.log(`   - Updated ${results.updatedTickets.count} Support Tickets`)

        } catch (error) {
            console.error(`❌ Error renaming "${oldName}":`, error)
        }
    }

    console.log('\n------------------------------------------------')
    console.log('✨ All operations completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
