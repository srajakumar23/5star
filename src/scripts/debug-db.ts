
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Connecting to DB...')
    try {
        // List tables in public schema
        const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
        console.log('Tables found in DB:', tables)

        // Check specifically for User/users
        const userTables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name ILIKE 'user%'
    `
        console.log('User-like tables:', userTables)

    } catch (e) {
        console.error('Error connecting or querying:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
