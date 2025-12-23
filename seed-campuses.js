
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const campuses = [
    { campusName: 'ASM-VILLIANUR(9-12)', campusCode: 'VIL912', location: 'Villianur', grades: '9-12', maxCapacity: 500, address: 'Villianur Main Road', contactPhone: '9000000001' },
    { campusName: 'ASM-VILLIANUR(MONT-8)', campusCode: 'VILM8', location: 'Villianur', grades: 'Mont-8', maxCapacity: 800, address: 'Villianur Main Road', contactPhone: '9000000002' },
    { campusName: 'ASM-VILLUPURAM', campusCode: 'VILPM', location: 'Villupuram', grades: 'K-12', maxCapacity: 600, address: 'Villupuram Highway', contactPhone: '9000000003' },
    { campusName: 'ASM-ALAPAKKAM', campusCode: 'ALPKM', location: 'Alapakkam', grades: 'K-12', maxCapacity: 400, address: 'Alapakkam Main Road', contactPhone: '9000000004' },
    { campusName: 'ADYAR', campusCode: 'ADYAR', location: 'Adyar', grades: 'K-12', maxCapacity: 300, address: 'Adyar, Chennai', contactPhone: '9000000005' },
    { campusName: 'AKLAVYA-RP', campusCode: 'AKLRP', location: 'Reddiyarpalayam', grades: 'K-12', maxCapacity: 350, address: 'Reddiyarpalayam', contactPhone: '9000000006' },
    { campusName: 'KKNAGAR', campusCode: 'KKNGR', location: 'KK Nagar', grades: 'K-12', maxCapacity: 450, address: 'KK Nagar, Chennai', contactPhone: '9000000007' },
    { campusName: 'VALASARAVAKKAM', campusCode: 'VALAS', location: 'Valasaravakkam', grades: 'K-12', maxCapacity: 400, address: 'Valasaravakkam, Chennai', contactPhone: '9000000008' }
]

async function main() {
    console.log('🌱 Seeding Campuses...')

    for (const campus of campuses) {
        await prisma.campus.upsert({
            where: { campusCode: campus.campusCode },
            update: {},
            create: {
                ...campus,
                isActive: true
            }
        })
        console.log(`✅ ${campus.campusName} ready`)
    }

    console.log('🎉 Campus seeding complete!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
