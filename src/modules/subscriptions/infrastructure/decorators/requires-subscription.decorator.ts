import { SetMetadata } from '@nestjs/common';

import { SubscriptionPlan } from '@modules/subscriptions/domain/value-objects/subscription-plan.vo';

export const REQUIRES_SUBSCRIPTION_KEY = 'RequiresSubscription-decorator';
export const RequiresSubscription = (...args: SubscriptionPlan[]) =>
  SetMetadata(REQUIRES_SUBSCRIPTION_KEY, args);
