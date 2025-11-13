import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ISubscriptionRepository } from '@modules/subscriptions/domain/repositories/subscription.repository';

import { StripeService } from '@modules/subscriptions/infrastructure/services/stripe.service';
import { SubscriptionMapper } from '@modules/subscriptions/infrastructure/mappers/subscription.mapper';

@Injectable()
export class CancelCurrentSubscriptionUseCase {
  constructor(
    @Inject('SubscriptionRepository')
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly stripeService: StripeService
  ) {}

  async execute(userId: string) {
    let subscription =
      await this.subscriptionRepository.findCurrentSubscriptionByUserId(userId);

    if (!subscription) {
      throw new NotFoundException(
        `No subscriptions were found for user: ${userId}`
      );
    }

    if (subscription.isCanceled) {
      throw new BadRequestException(
        `Your current subscription has already been canceled`
      );
    }

    subscription.cancel();
    subscription = await this.subscriptionRepository.save(subscription);

    await this.stripeService.cancelSubscription(
      subscription.stripeSubscriptionId
    );

    return SubscriptionMapper.toDTO(subscription);
  }
}
