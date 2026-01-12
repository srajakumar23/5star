import prisma from "@/lib/prisma"

/**
 * Checks if a specific action is rate-limited.
 * Uses Prisma (Postgres) to maintain state across multiple server instances.
 * 
 * @param identifier Unique key (e.g., "ip:login", "user:123:otp")
 * @param limit Max allowed requests
 * @param windowMs Time window in milliseconds
 * @returns { success: boolean, remaining: number }
 */
export async function checkRateLimit(identifier: string, limit: number = 5, windowMs: number = 60000) {
    const now = new Date()
    const windowStart = new Date(now.getTime() - windowMs)

    try {
        // Optimistic: Try to find existing record
        const record = await prisma.rateLimit.findUnique({
            where: { key: identifier }
        })

        if (!record) {
            // First request
            await prisma.rateLimit.create({
                data: {
                    key: identifier,
                    count: 1,
                    resetAt: new Date(now.getTime() + windowMs)
                }
            })
            return { success: true, remaining: limit - 1 }
        }

        if (record.resetAt < now) {
            // Window expired, reset
            await prisma.rateLimit.update({
                where: { key: identifier },
                data: {
                    count: 1,
                    resetAt: new Date(now.getTime() + windowMs)
                }
            })
            return { success: true, remaining: limit - 1 }
        }

        if (record.count >= limit) {
            // Limit exceeded
            return { success: false, remaining: 0 }
        }

        // Increment
        const updated = await prisma.rateLimit.update({
            where: { key: identifier },
            data: { count: record.count + 1 }
        })

        return { success: true, remaining: limit - updated.count }

    } catch (error) {
        // Fail open to avoid blocking legit users on DB error, but log it
        console.error("RateLimit Error:", error)
        return { success: true, remaining: 1 }
    }
}
