import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { SubscriptionEntity } from '@modules/subscriptions/domain/entities/subscription.entity';

export const UserCurrentSubscription = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): SubscriptionEntity | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.subscription;
  }
);
