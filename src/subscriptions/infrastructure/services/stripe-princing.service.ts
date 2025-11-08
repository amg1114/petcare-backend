import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SubscriptionPlan } from 'src/subscriptions/domain/value-objects/subscription-plan.vo';

@Injectable()
export class StripePricingService {
  constructor(private readonly configService: ConfigService) {}

  getPlanPriceId(plan: SubscriptionPlan) {
    if (plan === SubscriptionPlan.BASIC) return this.getBasicPriceId();

    return this.getProfessionalPriceId();
  }

  getBasicPriceId() {
    return this.configService.getOrThrow<string>('STRIPE_BASIC_PLAN_ID');
  }

  getProfessionalPriceId() {
    return this.configService.getOrThrow<string>('STRIPE_BASIC_PLAN_ID');
  }
}
