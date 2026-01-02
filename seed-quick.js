const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // 1. Super Admin
    const superAdmin = await prisma.admin.upsert({
        where: { adminMobile: '9100000000' },
        update: {},
        create: {
            adminName: 'Super Admin',
            adminMobile: '9100000000',
            role: 'Super Admin',
            status: 'Active'
        }
    })
    console.log('✅ Super Admin created:', superAdmin.adminName)

    // 2. Campus Head - Villianur
    const campusHead1 = await prisma.admin.upsert({
        where: { adminMobile: '9100000001' },
        update: {},
        create: {
            adminName: 'Campus Head - Villianur',
            adminMobile: '9100000001',
            role: 'CampusHead',
            assignedCampus: 'ASM-VILLIANUR(9-12)',
            status: 'Active'
        }
    })
    console.log('✅ Campus Head 1 created:', campusHead1.adminName)

    // 3. Campus Head - Adyar
    const campusHead2 = await prisma.admin.upsert({
        where: { adminMobile: '9100000002' },
        update: {},
        create: {
            adminName: 'Campus Head - Adyar',
            adminMobile: '9100000002',
            role: 'CampusHead',
            assignedCampus: 'ADYAR',
            status: 'Active'
        }
    })
    console.log('✅ Campus Head 2 created:', campusHead2.adminName)

    // 4. Admission Admin
    const admissionAdmin = await prisma.admin.upsert({
        where: { adminMobile: '9100000003' },
        update: {},
        create: {
            adminName: 'Admission Admin',
            adminMobile: '9100000003',
            role: 'Admission Admin',
            status: 'Active'
        }
    })
    console.log('✅ Admission Admin created:', admissionAdmin.adminName)

    // 5. Campus Admin
    const campusAdmin = await prisma.admin.upsert({
        where: { adminMobile: '9100000004' },
        update: {},
        create: {
            adminName: 'Campus Admin - KK Nagar',
            adminMobile: '9100000004',
            role: 'Campus Admin',
            assignedCampus: 'KKNAGAR',
            status: 'Active'
        }
    })
    console.log('✅ Campus Admin created:', campusAdmin.adminName)

    console.log('\n🎉 All admin accounts created successfully!')
    console.log('\n📋 Login Credentials:')
    console.log('1. Super Admin: 9100000000')
    console.log('2. Campus Head (Villianur): 9100000001')
    console.log('3. Campus Head (Adyar): 9100000002')
    console.log('4. Admission Admin: 9100000003')
    console.log('5. Campus Admin (KK Nagar): 9100000004')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
