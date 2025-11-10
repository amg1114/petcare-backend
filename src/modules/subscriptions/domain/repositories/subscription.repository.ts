import { SubscriptionEntity } from '../entities/subscription.entity';

/**
 * Interface for subscription repository operations
 */
export interface ISubscriptionRepository {
  save(subscription: SubscriptionEntity): Promise<SubscriptionEntity>;

  findByUserId(id: string): Promise<SubscriptionEntity[] | null>;

  findAllUncanceledSubscriptions(
    id: string,
  ): Promise<SubscriptionEntity[] | null>;

  findByStripeId(id: string): Promise<SubscriptionEntity | null>;

  findCurrentSubscriptionByUserId(
    id: string,
  ): Promise<SubscriptionEntity | null>;
}
