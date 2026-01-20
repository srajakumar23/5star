
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mapping: Old Name -> New Name
const campusMappings = [
    { oldName: 'ASM-ALAPAKKAM', newName: 'ASM - ALAPAKKAM' },
    { oldName: 'ADYAR', newName: 'ABSM - ADYAR' },
]

async function main() {
    console.log('🚀 Starting Campus Merge/Rename Process...')

    for (const mapping of campusMappings) {
        const { oldName, newName } = mapping
        console.log(`\n------------------------------------------------`)
        console.log(`Processing: "${oldName}" -> "${newName}"`)

        try {
            const oldCampus = await prisma.campus.findUnique({ where: { campusName: oldName } })
            const newCampus = await prisma.campus.findUnique({ where: { campusName: newName } })

            if (!oldCampus) {
                console.log(`⚠️ Source campus "${oldName}" NOT FOUND. Skipping.`)
                continue
            }

            await prisma.$transaction(async (tx) => {
                // SCENARIO 1: MERGE (Both exist)
                if (newCampus) {
                    console.log(`🔄 Both exist! Merging ID ${oldCampus.id} into ID ${newCampus.id}...`)

                    // 1. Move String References
                    const users = await tx.user.updateMany({ where: { assignedCampus: oldName }, data: { assignedCampus: newName } })
                    const admins = await tx.admin.updateMany({ where: { assignedCampus: oldName }, data: { assignedCampus: newName } })
                    const leads = await tx.referralLead.updateMany({ where: { campus: oldName }, data: { campus: newName } })
                    const tickets = await tx.supportTicket.updateMany({ where: { campus: oldName }, data: { campus: newName } })

                    // 2. Move Foreign Key ID References
                    // Users
                    const userIds = await tx.user.updateMany({ where: { campusId: oldCampus.id }, data: { campusId: newCampus.id } })
                    const userChildIds = await tx.user.updateMany({ where: { childCampusId: oldCampus.id }, data: { childCampusId: newCampus.id } })

                    // Students
                    const students = await tx.student.updateMany({ where: { campusId: oldCampus.id }, data: { campusId: newCampus.id } })

                    // CampusTargets (Handle duplicates? updateMany might fail if constraint)
                    // For targets/fees, we might have collisions. Safest is to DELETE old ones if new ones exist, or move if not.
                    // Simplified: Just deleting old campus will cascade delete relations usually.
                    // But we should try to preserve data if needed. For now, assuming Master Data in New Campus is correct.

                    // 3. Delete Old Campus
                    // We need to delete dependent records first if Cascade isn't set
                    await tx.gradeFee.deleteMany({ where: { campusId: oldCampus.id } })
                    await tx.campusTarget.deleteMany({ where: { campusId: oldCampus.id } })

                    await tx.campus.delete({ where: { id: oldCampus.id } })

                    console.log(`   ✅ Merged: Users(${users.count}), Refs(${userIds.count}), Students(${students.count})`)
                    console.log(`   ✅ Deleted Old Campus ID ${oldCampus.id}`)
                }
                // SCENARIO 2: RENAME (Only Old exists)
                else {
                    console.log(`✏️ Target missing. Renaming ID ${oldCampus.id}...`)

                    // 1. Rename Campus
                    await tx.campus.update({ where: { id: oldCampus.id }, data: { campusName: newName } })

                    // 2. Update String References
                    await tx.user.updateMany({ where: { assignedCampus: oldName }, data: { assignedCampus: newName } })
                    await tx.admin.updateMany({ where: { assignedCampus: oldName }, data: { assignedCampus: newName } })
                    await tx.referralLead.updateMany({ where: { campus: oldName }, data: { campus: newName } })
                    await tx.supportTicket.updateMany({ where: { campus: oldName }, data: { campus: newName } })

                    console.log(`   ✅ Renamed successfully.`)
                }
            })

        } catch (error) {
            console.error(`❌ Error processing "${oldName}":`, error)
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
