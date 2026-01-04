import {
    Controller,
    Post,
    Param,
    UseGuards,
    Headers,
    Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard, GetUser } from '../auth';

interface RawBodyRequest extends Request {
    rawBody?: Buffer;
}

@ApiTags('payments')
@Controller('api/payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('checkout/:orderId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create Stripe checkout session for an order' })
    createCheckoutSession(
        @Param('orderId') orderId: string,
        @GetUser('userId') userId: string,
    ) {
        return this.paymentsService.createCheckoutSession(orderId, userId);
    }

    @Post('webhook')
    @ApiOperation({ summary: 'Handle Stripe webhooks' })
    handleWebhook(
        @Req() req: RawBodyRequest,
        @Headers('stripe-signature') signature: string,
    ) {
        const payload = req.rawBody;
        if (!payload) {
            throw new Error('Raw body is required for webhook processing');
        }
        return this.paymentsService.handleWebhook(payload, signature);
    }
}
