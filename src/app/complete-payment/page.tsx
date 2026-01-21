import { getCurrentUser } from '@/lib/auth-service'
import { redirect } from 'next/navigation'
import PaymentButton from '@/components/payment/PaymentButton'

export default async function CompletePaymentPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/')
    }

    if ((user as any).paymentStatus === 'Success') {
        redirect('/dashboard')
    }

    // Default registration fee
    const amount = 25

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md shadow-xl bg-white rounded-xl overflow-hidden border border-gray-100">
                <div className="p-6 text-center border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-amber-600">Complete Registration</h2>
                    <p className="text-slate-500 mt-2">
                        Complete your payment to activate your account.
                    </p>
                </div>
                <div className="p-6 space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                        <p className="font-medium">User: {user.fullName}</p>
                        <p>Mobile: {user.mobileNumber}</p>
                        <p className="mt-2 text-lg font-bold">Amount Due: ₹{amount}</p>
                    </div>

                    <PaymentButton
                        amount={amount}
                        userId={user.userId}
                    />

                    <p className="text-xs text-center text-gray-500 mt-4">
                        If you face any issues, please contact support.
                    </p>
                </div>
            </div>
        </div>
    )
}
