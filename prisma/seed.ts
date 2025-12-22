
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ['info']
})

const STAFF_NAMES = ["Suresh Chandran", "Amit Patel", "Deepa Thomas", "Karan Johar", "Priya Menon"]
const PARENT_NAMES = ["Vikram Rathore", "Anjali Gupta", "Rohit Sharma", "Sneha Reddy", "Manish Malhotra"]

const SLABS = { 1: 5, 2: 10, 3: 25, 4: 30, 5: 50 } as const

async function main() {
    console.log('Starting seed...')

    // 1. Benefits Slabs
    const benefits = [
        { referralCount: 1, yearFeeBenefitPercent: 5, longTermExtraPercent: 5, baseLongTermPercent: 15 },
        { referralCount: 2, yearFeeBenefitPercent: 10, longTermExtraPercent: 10, baseLongTermPercent: 15 },
        { referralCount: 3, yearFeeBenefitPercent: 25, longTermExtraPercent: 15, baseLongTermPercent: 15 },
        { referralCount: 4, yearFeeBenefitPercent: 30, longTermExtraPercent: 20, baseLongTermPercent: 15 },
        { referralCount: 5, yearFeeBenefitPercent: 50, longTermExtraPercent: 25, baseLongTermPercent: 15 },
    ]

    for (const benefit of benefits) {
        await prisma.benefitSlab.upsert({
            where: { referralCount: benefit.referralCount },
            update: {},
            create: benefit,
        })
    }

    // 2. Admins
    await prisma.admin.upsert({
        where: { adminMobile: '9999999999' },
        update: {},
        create: {
            adminName: 'Super Admin',
            adminMobile: '9999999999',
            role: 'Super Admin'
        }
    })

    await prisma.admin.upsert({
        where: { adminMobile: '8888888888' },
        update: {},
        create: {
            adminName: 'Campus Head',
            adminMobile: '8888888888',
            role: 'Campus Head'
        }
    })

    await prisma.admin.upsert({
        where: { adminMobile: '7777777777' },
        update: {},
        create: {
            adminName: 'Admission Admin',
            adminMobile: '7777777777',
            role: 'Admission Admin'
        }
    })

    // 3. Generate Users (Staff & Parent)
    await generateGroup(STAFF_NAMES, 'Staff', '900000000')
    await generateGroup(PARENT_NAMES, 'Parent', '910000000')

    console.log('Seeding completed.')
}

async function generateGroup(names: string[], role: string, mobilePrefix: string) {
    for (let i = 0; i < names.length; i++) {
        const referralCount = i + 1 // 1, 2, 3, 4, 5
        const name = names[i]
        const mobile = `${mobilePrefix}${i + 1}` // 9000000001, 9000000002...
        const refCode = `ACH25-${role.substring(0, 1)}${i + 1}`

        // Calculate Benefits
        const yearBenefit = SLABS[referralCount as keyof typeof SLABS] || 0
        const longTermBenefit = 15 + (referralCount * 5) // Base 15 + 5 per ref

        // Upsert User
        const user = await prisma.user.upsert({
            where: { mobileNumber: mobile },
            update: {
                fullName: name,
                role: role,
                confirmedReferralCount: referralCount,
                yearFeeBenefitPercent: yearBenefit,
                longTermBenefitPercent: longTermBenefit,
                isFiveStarMember: true, // All are Ambassadors
                benefitStatus: 'Active',
                studentFee: 60000,
                academicYear: '2025-2026'
            },
            create: {
                fullName: name,
                mobileNumber: mobile,
                role: role,
                childInAchariya: true,
                referralCode: refCode,
                confirmedReferralCount: referralCount,
                yearFeeBenefitPercent: yearBenefit,
                longTermBenefitPercent: longTermBenefit,
                isFiveStarMember: true,
                benefitStatus: 'Active',
                studentFee: 60000,
                academicYear: '2025-2026'
            }
        })

        console.log(`Upserted ${role} ${name} (${referralCount} Refs)`)

        // Generate Leads
        await generateLeads(user.userId, referralCount)
    }
}

async function generateLeads(userId: number, count: number) {
    // Clear existing leads to prevent duplication/accumulation on re-seed
    await prisma.referralLead.deleteMany({ where: { userId } })

    const STATUSES = ['Confirmed']
    const CAMPUSES = [
        "ASM-VILLIANUR(9-12)", "ASM-VILLIANUR(MONT-8)", "ASM-VILLUPURAM", "ASM-ALAPAKKAM",
        "ADYAR", "AKLAVYA-RP", "KKNAGAR", "VALASARAVAKKAM", "ASM-MP", "ASM-TKM"
    ]
    const GRADES = ['Grade 1', 'Grade 5', 'KG 2', 'Grade 9', 'Grade 3']

    // 1. Generate Confirmed Leads (to match the required benefit count)
    for (let i = 0; i < count; i++) {
        await createLead(userId, 'Confirmed', i)
    }

    // 2. Generate Random Extra Leads (New/Follow-up) for realism
    const extras = Math.floor(Math.random() * 3) + 1 // 1 to 3 extra leads
    const EXTRA_STATUSES = ['New', 'Follow-up']

    for (let j = 0; j < extras; j++) {
        const randomStatus = EXTRA_STATUSES[Math.floor(Math.random() * EXTRA_STATUSES.length)]
        await createLead(userId, randomStatus, count + j)
    }
}

async function createLead(userId: number, status: string, index: number) {
    const CAMPUSES = [
        "ASM-VILLIANUR(9-12)", "ASM-VILLIANUR(MONT-8)", "ASM-VILLUPURAM", "ASM-ALAPAKKAM",
        "ADYAR", "AKLAVYA-RP", "KKNAGAR", "VALASARAVAKKAM", "ASM-MP", "ASM-TKM"
    ]
    const GRADES = ['Grade 1', 'Grade 5', 'KG 2', 'Grade 9', 'Grade 3']

    const parentMobile = `9${Math.floor(Math.random() * 900000000 + 100000000)}`

    // Only set confirmedDate if status is Confirmed
    const confirmedDate = status === 'Confirmed' ? new Date() : null

    // Only set admittedYear if status is Confirmed (optional, but logical)
    const admittedYear = status === 'Confirmed' ? '2025-2026' : null

    await prisma.referralLead.create({
        data: {
            parentName: `Demo Lead ${String(userId).substring(0, 4)}-${index + 1}`,
            parentMobile: parentMobile,
            campus: CAMPUSES[index % CAMPUSES.length],
            gradeInterested: GRADES[index % GRADES.length],
            admittedYear: admittedYear,
            leadStatus: status,
            userId: userId,
            confirmedDate: confirmedDate
        }
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
