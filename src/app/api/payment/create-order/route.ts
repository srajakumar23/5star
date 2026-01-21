import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import cashfree from "@/lib/cashfree";

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { amount } = await req.json();

        const user = await prisma.user.findUnique({
            where: { userId: session.userId as number },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const orderId = `ORDER_${Date.now()}_${user.userId}`;
        const customerPhone = user.mobileNumber || "9999999999";
        const customerName = user.fullName || "User";

        // Create order in Cashfree
        const request = {
            order_amount: amount,
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: user.userId.toString(),
                customer_phone: customerPhone,
                customer_name: customerName,
            },
            order_meta: {
                return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify?order_id={order_id}`,
            }
        };

        // Using the instance method
        const response = await cashfree.PGCreateOrder(request);
        const orderData = response.data;

        // Save to DB (Prisma Client updated)
        // @ts-ignore: Payment property exists but IDE cache is stale
        await prisma.payment.create({
            data: {
                orderId: orderData.order_id!,
                paymentSessionId: orderData.payment_session_id,
                orderAmount: amount,
                userId: user.userId,
                orderStatus: orderData.order_status,
            }
        });

        return NextResponse.json(orderData);
    } catch (error: any) {
        console.error("Payment Error:", error);
        // Handle Axios errors structure
        const msg = error.response?.data?.message || error.message || "Something went wrong";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
