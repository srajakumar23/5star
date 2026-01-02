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
        const { fullName, email, address } = await request.json()

        if (!fullName || fullName.trim().length < 2) {
            return NextResponse.json({ error: 'Full name must be at least 2 characters' }, { status: 400 })
        }

        // Update based on user type
        if (role === 'Super Admin' || role === 'CampusHead' || role === 'CampusAdmin') {
            if (!adminId) {
                return NextResponse.json({ error: 'Admin ID not found' }, { status: 400 })
            }
            await prisma.admin.update({
                where: { adminId },
                data: {
                    adminName: fullName.trim(),
                    email: email?.trim() || null,
                    address: address?.trim() || null
                }
            })
        } else {
            if (!userId) {
                return NextResponse.json({ error: 'User ID not found' }, { status: 400 })
            }
            await prisma.user.update({
                where: { userId },
                data: {
                    fullName: fullName.trim(),
                    email: email?.trim() || null,
                    address: address?.trim() || null
                }
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }
}
