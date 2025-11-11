import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { SubscriptionPlan } from '@modules/subscriptions/domain/value-objects/subscription-plan.vo';
import { CheckoutSessionDTO } from '@modules/subscriptions/application/dto/checkout-session-response.dto';

import { SubscriptionResponseDTO } from '../../application/dto/subscription-response.dto';

export function ApiGetOwnSubscription() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get current subscription',
      description: "Get the current user's subscription",
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: "Returns the user's subscription details",
      type: SubscriptionResponseDTO,
    }),
  );
}

export function ApiReactivateOwnCurrentSubscription() {
  return applyDecorators(
    ApiOperation({
      summary: 'Reactivate subscription',
      description: "Reactivate the current user's subscription",
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: "Returns the user's subscription details",
      type: SubscriptionResponseDTO,
    }),
  );
}

export function ApiCancelOwnSubscription() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cancel subscription',
      description: "Cancel the current user's subscription",
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: "Returns the user's subscription details",
      type: SubscriptionResponseDTO,
    }),
  );
}

export function ApiCheckoutSessionEndpoint() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a Stripe checkout session for getting a subscription',
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

export function ApiProtectionTestBasic() {
  return applyDecorators(
    ApiOperation({
      summary: 'Test basic subscription protection',
      description: 'Endpoint to test if the required basic subscription works',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Basic subscription access granted',
    }),
  );
}
export function ApiProtectionTestProfessional() {
  return applyDecorators(
    ApiOperation({
      summary: 'Test professional subscription protection',
      description:
        'Endpoint to test if the required professional subscription works',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Professional subscription access granted',
    }),
  );
}
