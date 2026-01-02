const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// S. No | Campus name | Campus-wise grade
const campuses = [
    { id: 1, name: "ASM - Villianur", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1, 2, 3, 4, 5, 6, 7, 8, 9, 11", code: "ASM-VIL" },
    { id: 3, name: "ABSM - Thengaithittu", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1, 2, 3, 4, 5, 6, 7, 8, 9, 11", code: "ABSM-TGT" },
    { id: 4, name: "AKLAVYA - Thengaithittu", grades: "Grade - 1, 2, 3, 4, 5, 6, 7, 8, 9, 11", code: "AKL-TGT" },
    { id: 5, name: "SSV - Villianur", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1, 2, 3, 4, 5, 6, 7, 8, 9, 11", code: "SSV-VIL" },
    { id: 7, name: "ASM - Thavalakuppam", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1, 2, 3, 4, 5, 6, 7, 8", code: "ASM-TVK" },
    { id: 8, name: "ASM - Moolakulam", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1, 2, 3, 4, 5, 6, 7, 8", code: "ASM-MK" },
    { id: 9, name: "ASM - Karaikal", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1, 2, 3, 4, 5, 6, 7, 8, 9, 11", code: "ASM-KKL" },
    { id: 10, name: "AWGI - Ettimadai", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1, 2, 3, 4, 5, 6, 7, 8, 9, 11", code: "AWGI-ET" },
    { id: 11, name: "AIIS - Erode", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1, 2, 3, 4, 5, 6, 7, 8, 9, 11", code: "AIIS-ERD" },
    { id: 12, name: "ASM TRICHY", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1, 2, 3, 4, 5, 6, 7, 8, 9", code: "ASM-TRY" },
    { id: 13, name: "ABSM - Tindivanam", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1, 2, 3, 4, 5", code: "ABSM-TVM" },
    { id: 14, name: "ASM - Villupuram", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1, 2, 3, 4, 5, 6, 7, 8, 9", code: "ASM-VPM" },
    { id: 15, name: "AKLAVYA - Reddiyarpalayam", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1", code: "AKL-RDP" },
    { id: 16, name: "ASM - Muthirapalayam", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1, 2, 3, 4", code: "ASM-MTP" },
    { id: 17, name: "ABSM - Gorimedu", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1", code: "ABSM-GMD" },
    { id: 18, name: "ABSM - Lawspet", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1", code: "ABSM-LAW" },
    { id: 19, name: "ABSM - Muthiyalpet", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1, 2, 3", code: "ABSM-MUT" },
    { id: 20, name: "ABSM - Kalapet", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1", code: "ABSM-KAL" },
    { id: 21, name: "ABSM - Venkata Nagar", grades: "Pre - Mont, Mont - I, Mont - II", code: "ABSM-VN" },
    { id: 22, name: "AKLAVYA - ANUGRAHA", grades: "Pre - Mont, Mont - I, Mont - II", code: "AKL-AGR" },
    { id: 23, name: "ABSM TRICHY", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1", code: "ABSM-TRY" },
    { id: 24, name: "ACC - ERODE", grades: "Pre - Mont, Mont - I, Mont - II", code: "ACC-ERD" },
    { id: 25, name: "ASM Erode - Perundurai campus", grades: "Pre - Mont, Mont - I, Mont - II", code: "ASM-ERD" },
    { id: 26, name: "ASM ALAPAKKAM", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1, 2, 3, 4, 5, 6, 7, 8, 9", code: "ASM-ALP" },
    { id: 27, name: "ABSM ADYAR", grades: "Pre - Mont, Mont - I, Mont - II", code: "ABSM-ADY" },
    { id: 28, name: "ABSM KK Nagar", grades: "Mont - II, Grade - 1, 2, 3, 4, 5", code: "ABSM-KKN" },
    { id: 29, name: "ABSM - Varasalavakam", grades: "Grade 1, 2, 3, 4, 5", code: "ABSM-VAL" },
    { id: 30, name: "ABSM - Padmanabhanagar", grades: "Grade 1, 2, 3, 4, 5", code: "ABSM-PBN" },
    { id: 31, name: "ABSM - DASARATHAPURAM", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1", code: "ABSM-DST" },
    { id: 32, name: "ABSM - SALIGRAMAM", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1", code: "ABSM-SAL" },
    { id: 33, name: "ABSM RK Nagar", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1", code: "ABSM-RKN" },
    { id: 34, name: "ABSM ALAPAKKAM", grades: "Pre - Mont, Mont - I, Mont - II", code: "ABSM-ALP" },
    { id: 35, name: "ABSM THIRU NAGAR", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1", code: "ABSM-THN" },
    { id: 36, name: "ABSM MADURAVOYAL", grades: "Pre - Mont, Mont - I, Mont - II", code: "ABSM-MDV" },
    { id: 37, name: "ABSM NOLAMBUR", grades: "Pre - Mont, Mont - I, Mont - II, Grade - 1, 2, 3", code: "ABSM-NOL" },
]

async function main() {
    console.log('🌱 Seeding 37 Campuses from Master List...')
    for (const campus of campuses) {
        // Upsert by ID to preserve the numbering from the sheet (if consistent)
        // Or upsert by Name and set Code if missing.
        // Using upsert by ID if possible, but ID is autoincrement usually.
        // Let's check Schema. ID is Autoincrement. We can force it in Postgres usually but Prisma creates new IDs if we don't provide.
        // BUT upsert matches by unique. Name is unique.

        await prisma.campus.upsert({
            where: { campusName: campus.name },
            update: {
                campusCode: campus.code,
                grades: campus.grades,
                location: 'Puducherry/TN', // Default fallback
                isActive: true
            },
            create: {
                // If we want to force ID, we can try, but Prisma usually ignores it unless enabled.
                // We'll just map the names.
                campusName: campus.name,
                campusCode: campus.code,
                location: 'Puducherry/TN',
                grades: campus.grades,
                isActive: true
            }
        })
        console.log(`✅ Upserted: ${campus.name}`)
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
