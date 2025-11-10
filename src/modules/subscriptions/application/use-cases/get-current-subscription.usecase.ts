import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { SubscriptionMapper } from '@modules/subscriptions/infrastructure/mappers/subscription.mapper';

import { ISubscriptionRepository } from '@modules/subscriptions/domain/repositories/subscription.repository';

@Injectable()
export class GetCurrentSubscriptionUseCase {
  constructor(
    @Inject('SubscriptionRepository')
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(userId: string) {
    const subscription =
      await this.subscriptionRepository.findCurrentSubscriptionByUserId(userId);

    if (!subscription) {
      throw new NotFoundException(
        `No subscriptions were found for user: ${userId}`,
      );
    }

    return SubscriptionMapper.toDTO(subscription);
  }
}
