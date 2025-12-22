import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const sessionData = cookieStore.get('session')?.value

        if (!sessionData) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { userId, adminId, role } = JSON.parse(sessionData)
        const { image } = await request.json()

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 })
        }

        // Update based on user type
        if (role === 'Super Admin' || role === 'CampusHead' || role === 'CampusAdmin') {
            if (!adminId) {
                return NextResponse.json({ error: 'Admin ID not found' }, { status: 400 })
            }
            await prisma.admin.update({
                where: { adminId },
                data: { profileImage: image }
            })
        } else {
            if (!userId) {
                return NextResponse.json({ error: 'User ID not found' }, { status: 400 })
            }
            await prisma.user.update({
                where: { userId },
                data: { profileImage: image }
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Profile photo upload error:', error)
        return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 })
    }
}
