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

  mapPriceIdToPlan(priceId: string) {
    const basicPriceId = this.getBasicPriceId();
    const professionalPriceId = this.getProfessionalPriceId();

    if (professionalPriceId === priceId) return SubscriptionPlan.PROFESSIONAL;

    if (basicPriceId === priceId) return SubscriptionPlan.BASIC;

    throw new Error('The given price ID is not registered in the API');
  }

  getBasicPriceId() {
    return this.configService.getOrThrow<string>('STRIPE_BASIC_PLAN_ID');
  }

  getProfessionalPriceId() {
    return this.configService.getOrThrow<string>('STRIPE_BASIC_PLAN_ID');
  }
}
