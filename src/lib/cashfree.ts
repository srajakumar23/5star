import { Cashfree, CFEnvironment } from "cashfree-pg";

let cashfree: Cashfree;

try {
    const appId = process.env.CASHFREE_APP_ID!;
    const secretKey = process.env.CASHFREE_SECRET_KEY!;
    const isProd = process.env.CASHFREE_ENV === 'PRODUCTION';

    // Initialize using the exported CFEnvironment enum
    cashfree = new Cashfree(
        isProd ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
        appId,
        secretKey
    );
} catch (error) {
    console.error("Failed to initialize Cashfree:", error);
    // @ts-ignore
    cashfree = undefined as any;
}

export default cashfree;
