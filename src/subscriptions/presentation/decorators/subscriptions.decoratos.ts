import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CheckoutSessionDTO } from 'src/subscriptions/application/dto/checkout-session-response.dto';
import { SubscriptionPlan } from 'src/subscriptions/domain/value-objects/subscription-plan.vo';

export function ApiCheckoutSessionEndpoint() {
  return applyDecorators(
    ApiOperation({
      description:
        'Create a Stripe checkout session for the given subscription plan',
    }),
    ApiParam({
      name: 'plan',
      description: 'Subscription plan to purchase',
      required: true,
      enum: SubscriptionPlan,
    }),
    ApiResponse({
      type: CheckoutSessionDTO,
      status: HttpStatus.CREATED,
      description: 'The created stripe checkout session details',
    }),
  );
}
