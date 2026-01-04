import { ConfigService } from '@nestjs/config';
import { OrdersService } from '../orders';
export declare class PaymentsService {
    private configService;
    private ordersService;
    private stripe;
    private readonly logger;
    constructor(configService: ConfigService, ordersService: OrdersService);
    createCheckoutSession(orderId: string, userId: string): Promise<{
        url: string | null;
        sessionId: string;
    }>;
    handleWebhook(payload: Buffer, signature: string): Promise<{
        received: boolean;
    }>;
}
