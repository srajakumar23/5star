
'use server'

import { smsService } from '@/lib/sms-service'

export async function testSmsAction(mobile: string) {
    try {
        console.log('Testing SMS for:', mobile)
        const result = await smsService.sendOTP(mobile, '1234', 'registration')
        return {
            success: true,
            result,
            env: {
                provider: process.env.SMS_PROVIDER,
                authKeySet: !!process.env.MSG91_AUTH_KEY,
                templateId: process.env.MSG91_TEMPLATE_ID_REGISTRATION
            }
        }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
