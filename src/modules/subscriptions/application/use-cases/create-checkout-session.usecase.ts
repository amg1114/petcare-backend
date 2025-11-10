import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SubscriptionPlan } from '@modules/subscriptions/domain/value-objects/subscription-plan.vo';
import { StripePricingService } from '@modules/subscriptions/infrastructure/services/stripe-princing.service';
import { StripeService } from '@modules/subscriptions/infrastructure/services/stripe.service';

import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { CheckoutSessionDTO } from '../dto/checkout-session-response.dto';

@Injectable()
export class CreateCheckoutSessionUseCase {
  constructor(
    @Inject('UserRepository')
    private userRepository: UserRepository,
    private readonly stripeService: StripeService,
    private readonly stripePricingService: StripePricingService,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    userId: string,
    plan: SubscriptionPlan,
  ): Promise<CheckoutSessionDTO> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with the ID ${userId} was not found`);
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      customerId = await this.stripeService.createCustomer(
        user.email,
        user.name,
      );

      user.stripeCustomerId = customerId;
      await this.userRepository.save(user);
    }

    const priceId = this.stripePricingService.getPlanPriceId(plan);

    const session = await this.stripeService.createCheckoutSession({
      customerId,
      priceId,
      successUrl: this.configService.getOrThrow<string>('SUCCESS_PAYMENT_URL'),
      cancelUrl: this.configService.getOrThrow<string>('CANCEL_PAYMENT_URL'),
    });

    return {
      sessionId: session.id,
      checkoutUrl: session.url,
    };
  }
}
