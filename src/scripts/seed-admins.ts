import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const admins = [
        { name: 'Super Admin', mobile: '9999999999', role: 'Super Admin' as any },
        { name: 'Campus Head', mobile: '8888888888', role: 'Campus Head' as any },
        { name: 'Admission Admin', mobile: '7777777777', role: 'Admission Admin' as any },
        { name: 'Finance Admin', mobile: '6666666666', role: 'Finance Admin' as any },
    ]

    console.log('Seeding administrators...')

    for (const admin of admins) {
        try {
            const exists = await prisma.admin.findUnique({
                where: { adminMobile: admin.mobile }
            })

            if (!exists) {
                console.log(`Creating ${admin.name}...`)
                const hashedPassword = await bcrypt.hash('123456', 10)
                await prisma.admin.create({
                    data: {
                        adminName: admin.name,
                        adminMobile: admin.mobile,
                        role: admin.role,
                        password: hashedPassword,
                        status: 'Active'
                    }
                })
                console.log(`✅ Created ${admin.name}`)
            } else {
                console.log(`🔄 ${admin.name} already exists. Updating role...`)
                await prisma.admin.update({
                    where: { adminMobile: admin.mobile },
                    data: { role: admin.role }
                })
                console.log(`✅ Updated ${admin.name}`)
            }
        } catch (error: any) {
            console.error(`❌ Error processing ${admin.name}:`, error.message)
        }
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
