
import { LeadStatus, PrismaClient } from '@prisma/client'

console.log('Checking LeadStatus Enum...')
try {
    console.log('LeadStatus keys:', Object.keys(LeadStatus))
    console.log('LeadStatus.New:', LeadStatus.New)
    console.log('SUCCESS: LeadStatus is exported and working.')

    console.log('Checking AcademicYear Model (Dynamic Check)...')
    const prisma = new PrismaClient()
    // @ts-ignore
    if (prisma.academicYear) {
        // @ts-ignore
        const count = await prisma.academicYear.count()
        console.log('SUCCESS: AcademicYear model exists. Count:', count)
    } else {
        console.error('ERROR: academicYear model is MISSING from prisma client instance.')
        console.log('Available keys on prisma:', Object.keys(prisma))
    }
} catch (e) {
    console.error('ERROR: Verification failed.', e)
} finally {
    const prisma = new PrismaClient()
    await prisma.$disconnect()
}
