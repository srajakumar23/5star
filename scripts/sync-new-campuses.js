const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Provided List (34 Items)
const newCampusNames = [
    "ASM - VILLIANUR",
    "ABSM - THENGAITHITTU",
    "AKLAVYA - THENGAITHITTU",
    "SSV - VILLIANUR",
    "ASM - THAVALAKUPPAM",
    "ASM - MOOLAKULAM",
    "ASM - KARAIKAL",
    "AWGI - ETTIMADAI",
    "AIIS - ERODE",
    "ASM - TRICHY",
    "ABSM - TINDIVANAM",
    "ASM - VILLUPURAM",
    "AKLAVYA - REDDIYARPALAYAM",
    "ASM - MUTHIRAPALAYAM",
    "ABSM - GORIMEDU",
    "ABSM - LAWSPET",
    "ABSM - MUTHIYALPET",
    "ABSM - KALAPET",
    "ABSM - VENKATA NAGAR",
    "AKLAVYA - ANUGRAHA",
    "ABSM - TRICHY",
    "ASM CC - ERODE",
    "ASM - PERUNDURAI",
    "ASM - ALAPAKKAM",
    "ABSM - ADYAR",
    "ABSM - KK NAGAR",
    "ABSM - VARASALAVAKAM",
    "ABSM - PADMANABHANAGAR",
    "ABSM - DASARATHAPURAM",
    "ABSM - SALIGRAMAM",
    "ABSM - RK NAGAR",
    "ABSM - ALAPAKKAM",
    "ABSM - THIRU NAGAR",
    "ABSM - MADURAVOYAL",
    "ABSM - NOLAMBUR"
]

const DEFAULT_GRADES = "Pre - Mont, Mont - I, Mont - II, Grade - 1 to 12"

async function main() {
    console.log('🔄 Syncing New Campus List...')

    // 1. Deactivate ALL campuses first
    await prisma.campus.updateMany({
        data: { isActive: false }
    })
    console.log('⚪ All campuses deactivated.')

    const existingCampuses = await prisma.campus.findMany()

    for (const newName of newCampusNames) {
        // Simple normalization for matching
        const normalizedNew = newName.toLowerCase().replace(/\s+/g, '').replace(/-/g, '')

        let match = existingCampuses.find(c => {
            const normalizedOld = c.campusName.toLowerCase().replace(/\s+/g, '').replace(/-/g, '')
            return normalizedOld === normalizedNew
        })

        // Special mappings for renames
        if (!match && newName === "ASM CC - ERODE") {
            match = existingCampuses.find(c => c.campusName === "ACC - ERODE")
        }
        if (!match && newName === "ASM - PERUNDURAI") {
            match = existingCampuses.find(c => c.campusName === "ASM Erode - Perundurai campus")
        }

        if (match) {
            // Update existing
            await prisma.campus.update({
                where: { id: match.id },
                data: {
                    campusName: newName, // Update string (e.g. to UPPERCASE)
                    isActive: true
                }
            })
            console.log(`✅ Updated: ${newName} (was ${match.campusName})`)
        } else {
            // Create new
            // Generate basic code
            const code = newName.split(' ').map(w => w[0]).join('').toUpperCase() + Math.floor(Math.random() * 100)

            await prisma.campus.create({
                data: {
                    campusName: newName,
                    campusCode: code,
                    location: 'Puducherry/TN',
                    grades: DEFAULT_GRADES,
                    isActive: true
                }
            })
            console.log(`✨ Created New: ${newName}`)
        }
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
