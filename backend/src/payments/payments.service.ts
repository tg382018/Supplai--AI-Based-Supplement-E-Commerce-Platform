import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { OrdersService } from '../orders';

@Injectable()
export class PaymentsService {
    private stripe: Stripe;
    private readonly logger = new Logger(PaymentsService.name);

    constructor(
        private configService: ConfigService,
        private ordersService: OrdersService,
    ) {
        const secretKey = this.configService.get<string>('stripe.secretKey');
        this.stripe = new Stripe(secretKey || '');
    }

    async createCheckoutSession(orderId: string, userId: string) {
        const order = await this.ordersService.findOne(orderId, userId);

        if (!order) {
            throw new BadRequestException('Order not found');
        }

        const lineItems = order.items.map(item => ({
            price_data: {
                currency: 'try',
                product_data: {
                    name: item.product.name,
                    description: item.product.description,
                    images: item.product.imageUrl ? [item.product.imageUrl] : [],
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${this.configService.get('frontendUrl')}/orders/${orderId}?success=true`,
            cancel_url: `${this.configService.get('frontendUrl')}/orders/${orderId}?canceled=true`,
            metadata: {
                orderId,
                userId,
            },
        });

        await this.ordersService.updateStripeSession(orderId, session.id);

        return { url: session.url, sessionId: session.id };
    }

    async handleWebhook(payload: Buffer, signature: string) {
        const webhookSecret = this.configService.get<string>('stripe.webhookSecret') || '';

        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        } catch (err: any) {
            this.logger.error(`Webhook signature verification failed: ${err.message}`);
            throw new BadRequestException('Invalid signature');
        }

        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session;
                if (session.metadata?.orderId) {
                    await this.ordersService.markAsPaid(session.id, session.payment_intent as string);
                    this.logger.log(`Order paid: ${session.metadata.orderId}`);
                }
                break;

            case 'payment_intent.payment_failed':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                this.logger.warn(`Payment failed: ${paymentIntent.id}`);
                break;

            default:
                this.logger.log(`Unhandled event type: ${event.type}`);
        }

        return { received: true };
    }
}
