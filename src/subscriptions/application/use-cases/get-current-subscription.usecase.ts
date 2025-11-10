import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISubscriptionRepository } from 'src/subscriptions/domain/repositories/subscription.repository';
import { SubscriptionMapper } from 'src/subscriptions/infrastructure/mappers/subscription.mapper';

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
