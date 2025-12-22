import 'server-only'
import { getSession } from './session'
import prisma from './prisma'
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
    const session: any = await getSession()
    if (!session || !session.userId) return null

    if (session.userType === 'admin') {
        const admin = await prisma.admin.findUnique({
            where: { adminId: Number(session.userId) }
        })
        if (admin) {
            // Map to User-like structure for compatibility
            return {
                ...admin,
                userId: admin.adminId, // Map for compatibility
                fullName: admin.adminName,
                mobileNumber: admin.adminMobile,
                // Keep role as-is - don't modify it
                // Super Admin should stay "Super Admin"
                // CampusHead should stay "CampusHead"
                // Admission Admin can stay "Admission Admin"
                role: admin.role
            }
        }
    }

    const user = await prisma.user.findUnique({
        where: { userId: Number(session.userId) }
    })

    return user
})
