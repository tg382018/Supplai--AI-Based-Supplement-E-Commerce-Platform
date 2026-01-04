"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = __importDefault(require("stripe"));
const orders_1 = require("../orders");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    configService;
    ordersService;
    stripe;
    logger = new common_1.Logger(PaymentsService_1.name);
    constructor(configService, ordersService) {
        this.configService = configService;
        this.ordersService = ordersService;
        const secretKey = this.configService.get('stripe.secretKey');
        this.stripe = new stripe_1.default(secretKey || '');
    }
    async createCheckoutSession(orderId, userId) {
        const order = await this.ordersService.findOne(orderId, userId);
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
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
    async handleWebhook(payload, signature) {
        const webhookSecret = this.configService.get('stripe.webhookSecret') || '';
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        }
        catch (err) {
            this.logger.error(`Webhook signature verification failed: ${err.message}`);
            throw new common_1.BadRequestException('Invalid signature');
        }
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                if (session.metadata?.orderId) {
                    await this.ordersService.markAsPaid(session.id, session.payment_intent);
                    this.logger.log(`Order paid: ${session.metadata.orderId}`);
                }
                break;
            case 'payment_intent.payment_failed':
                const paymentIntent = event.data.object;
                this.logger.warn(`Payment failed: ${paymentIntent.id}`);
                break;
            default:
                this.logger.log(`Unhandled event type: ${event.type}`);
        }
        return { received: true };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        orders_1.OrdersService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map