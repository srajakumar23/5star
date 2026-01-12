export type ServiceResult<T> =
    | { success: true; data: T }
    | { success: false; error: string; code?: string }

export class AppError extends Error {
    public code?: string
    constructor(message: string, code?: string) {
        super(message)
        this.code = code
        Object.setPrototypeOf(this, AppError.prototype)
    }
}

export abstract class BaseService {
    protected handleError(error: unknown, context: string): ServiceResult<any> {
        console.error(`[${context}] Error:`, error)
        if (error instanceof AppError) {
            return { success: false, error: error.message, code: error.code }
        }
        if (error instanceof Error) {
            return { success: false, error: error.message }
        }
        return { success: false, error: 'An unexpected error occurred' }
    }
}
