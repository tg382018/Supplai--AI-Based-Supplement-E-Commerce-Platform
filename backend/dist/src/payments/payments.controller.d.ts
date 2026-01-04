import { Request } from 'express';
import { PaymentsService } from './payments.service';
interface RawBodyRequest extends Request {
    rawBody?: Buffer;
}
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createCheckoutSession(orderId: string, userId: string): Promise<{
        url: string | null;
        sessionId: string;
    }>;
    handleWebhook(req: RawBodyRequest, signature: string): Promise<{
        received: boolean;
    }>;
}
export {};
