import crypto from 'crypto'

/**
 * Standard AES-256-GCM encryption for field-level security.
 * Ensure ENCRYPTION_KEY is a 32-character string in your environment.
 */

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '5star-celeb-25yr-secure-key-32ch'
const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12

export function encrypt(text: string | null | undefined): string | null {
    if (!text) return null
    try {
        const iv = crypto.randomBytes(IV_LENGTH)
        const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv)
        let encrypted = cipher.update(text, 'utf8', 'hex')
        encrypted += cipher.final('hex')
        const authTag = cipher.getAuthTag().toString('hex')
        // Format: iv:authTag:encryptedContent
        return `${iv.toString('hex')}:${authTag}:${encrypted}`
    } catch (error) {
        console.error('Encryption failed:', error)
        return text // Fallback to plain text if encryption fails (better than crashing in some cases, but warn)
    }
}

export function decrypt(hash: string | null | undefined): string | null {
    if (!hash || !hash.includes(':')) return hash || null
    try {
        const [iv, authTag, encrypted] = hash.split(':')
        if (!iv || !authTag || !encrypted) return hash

        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), Buffer.from(iv, 'hex'))
        decipher.setAuthTag(Buffer.from(authTag, 'hex'))
        let decrypted = decipher.update(encrypted, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        return decrypted
    } catch (error) {
        // If it's not encrypted or decryption fails, return as is
        return hash
    }
}
