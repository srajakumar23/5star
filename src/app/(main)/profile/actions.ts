'use server'

import { getCurrentUser } from '@/lib/auth-service'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

export async function changePassword(currentState: any, formData: FormData) {
    const user = await getCurrentUser()
    if (!user) {
        return { success: false, error: 'Unauthorized' }
    }

    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { success: false, error: 'All fields are required' }
    }

    if (newPassword !== confirmPassword) {
        return { success: false, error: 'New passwords do not match' }
    }

    if (newPassword.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters' }
    }

    try {
        // Fetch fresh user record with password
        const dbUser = await prisma.user.findUnique({
            where: { userId: Number(user.userId) }
        })

        if (!dbUser || !dbUser.password) {
            return { success: false, error: 'User not found' }
        }

        const isValid = await bcrypt.compare(currentPassword, dbUser.password)
        if (!isValid) {
            return { success: false, error: 'Incorrect current password' }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await prisma.user.update({
            where: { userId: Number(user.userId) },
            data: { password: hashedPassword }
        })

        revalidatePath('/profile')
        return { success: true, message: 'Password updated successfully' }
    } catch (error) {
        console.error('Password update error:', error)
        return { success: false, error: 'Failed to update password' }
    }
}
