'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Short URL redirect page
 * Handles encrypted referral codes and redirects to the referral form
 * Pattern: /r/{encryptedCode}
 * 
 * Next.js 15: params is now a Promise and must be unwrapped
 */
export default function ShortUrlPage({ params }: { params: Promise<{ code: string }> }) {
    // Unwrap the Promise using React.use() (Next.js 15 requirement)
    const { code } = use(params)
    const router = useRouter()

    useEffect(() => {
        try {
            // Redirect to the refer page with the encrypted code
            router.replace(`/refer?ref=${code}`)
        } catch (error) {
            console.error('Failed to process referral code:', error)
            // Fallback to home on error
            router.replace('/')
        }
    }, [code, router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-maroon/5 to-primary-gold/5">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-maroon/20 border-t-primary-maroon rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading referral...</p>
            </div>
        </div>
    )
}
