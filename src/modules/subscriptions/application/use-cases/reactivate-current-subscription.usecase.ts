import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { SubscriptionMapper } from '@modules/subscriptions/infrastructure/mappers/subscription.mapper';

import { StripeService } from '@modules/subscriptions/infrastructure/services/stripe.service';

import { ISubscriptionRepository } from '@modules/subscriptions/domain/repositories/subscription.repository';

@Injectable()
export class ReactivateCurrentSubscriptionUseCase {
  constructor(
    @Inject('SubscriptionRepository')
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly stripeService: StripeService,
  ) {}

  async execute(userId: string) {
    let subscription =
      await this.subscriptionRepository.findCurrentSubscriptionByUserId(userId);

    if (!subscription) {
      throw new NotFoundException(
        `No subscriptions were found for user: ${userId}`,
      );
    }

    if (!subscription.canReactivate) {
      throw new BadRequestException(
        'Your subscription cannot be reactivated. It may have already expired or is not scheduled for cancellation.',
      );
    }

    await this.stripeService.reactivateSubscription(
      subscription.stripeSubscriptionId,
    );

    subscription.reactivate();
    subscription = await this.subscriptionRepository.save(subscription);

    return SubscriptionMapper.toDTO(subscription);
  }
}
