import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ISubscriptionRepository } from 'src/subscriptions/domain/repositories/subscription.repository';
import { SubscriptionMapper } from 'src/subscriptions/infrastructure/mappers/subscription.mapper';
import { StripeService } from 'src/subscriptions/infrastructure/services/stripe.service';

@Injectable()
export class CancelCurrentSubscriptionUseCase {
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

    if (subscription.isCanceled) {
      throw new BadRequestException(
        `Your current subscription has already been canceled`,
      );
    }

    subscription.cancel();
    subscription = await this.subscriptionRepository.save(subscription);

    await this.stripeService.cancelSubscription(
      subscription.stripeSubscriptionId,
    );

    return SubscriptionMapper.toDTO(subscription);
  }
}
