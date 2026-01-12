import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Connecting to DB...')
    try {
        // List all tables in public schema
        const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `
        console.log('Tables found:', tables)

        // Check specifically for User table variatioms
        const userTableLower = await prisma.$queryRaw`
        SELECT * FROM "users" LIMIT 1;
    `.catch(() => 'users table not found')
        console.log('Query "users":', userTableLower === 'users table not found' ? 'Not found' : 'Found')

        const userTablePascal = await prisma.$queryRaw`
        SELECT * FROM "User" LIMIT 1;
    `.catch(() => 'User table not found')
        console.log('Query "User":', userTablePascal === 'User table not found' ? 'Not found' : 'Found')

    } catch (e) {
        console.error('Error connecting or querying:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
