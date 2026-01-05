import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const CAMPUS_DATA = [
    { name: "ASM-VILLIANUR(9-12)", code: "VILL-912", location: "Villianur", grades: "9-12" },
    { name: "ASM-VILLIANUR(MONT-8)", code: "VILL-M8", location: "Villianur", grades: "MONT-8" },
    { name: "ASM-VILLUPURAM", code: "VILLP", location: "Villupuram", grades: "K-12" },
    { name: "ASM-ALAPAKKAM", code: "ALAP", location: "Alapakkam", grades: "K-12" },
    { name: "ADYAR", code: "ADY", location: "Chennai-Adyar", grades: "K-12" },
    { name: "AKLAVYA-RP", code: "AKL-RP", location: "Pondicherry", grades: "K-12" },
    { name: "KKNAGAR", code: "KKN", location: "Chennai-KK Nagar", grades: "K-12" },
    { name: "VALASARAVAKKAM", code: "VALA", location: "Chennai-Valasaravakkam", grades: "K-12" },
    { name: "ASM-MP", code: "MP", location: "Madha Pattinam", grades: "K-12" },
    { name: "ASM-TKM", code: "TKM", location: "Thendral Kottam", grades: "K-12" }
]

const GRADES = [
    "Pre-KG", "LKG", "UKG",
    "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
    "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
    "Grade 11", "Grade 12"
]

function getFeeForGrade(grade: string) {
    if (grade.includes("KG")) return 45000
    const gradeNum = parseInt(grade.replace("Grade ", ""))
    if (gradeNum >= 1 && gradeNum <= 5) return 55000
    if (gradeNum >= 6 && gradeNum <= 10) return 65000
    if (gradeNum >= 11 && gradeNum <= 12) return 75000
    return 60000 // default
}

async function main() {
    console.log('Adding campuses with grade fees...')

    for (const c of CAMPUS_DATA) {
        const campus = await prisma.campus.upsert({
            where: { campusName: c.name },
            update: {
                campusCode: c.code,
                location: c.location,
                grades: c.grades
            },
            create: {
                campusName: c.name,
                campusCode: c.code,
                location: c.location,
                grades: c.grades,
                maxCapacity: 1000
            }
        })

        console.log(`✓ Campus: ${campus.campusName}`)

        // Add Grade Fees
        for (const grade of GRADES) {
            const existingGf = await prisma.gradeFee.findFirst({
                where: { campusId: campus.id, grade: grade }
            })

            if (existingGf) {
                await prisma.gradeFee.update({
                    where: { id: existingGf.id },
                    data: { annualFee: getFeeForGrade(grade) }
                })
            } else {
                await prisma.gradeFee.create({
                    data: {
                        campusId: campus.id,
                        grade: grade,
                        annualFee: getFeeForGrade(grade),
                        academicYear: '2025-2026'
                    }
                })
            }
        }
    }

    console.log('Done!')
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
