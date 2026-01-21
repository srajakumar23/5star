declare module '@cashfreepayments/cashfree-js' {
    export interface CashfreeLoadOptions {
        mode: 'sandbox' | 'production';
    }

    export interface CheckoutOptions {
        paymentSessionId: string;
        redirectTarget?: '_self' | '_blank' | '_top' | '_parent';
        returnUrl?: string;
    }

    export interface Cashfree {
        checkout(options: CheckoutOptions): Promise<void>;
    }

    export function load(options: CashfreeLoadOptions): Promise<Cashfree>;
}
