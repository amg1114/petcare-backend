import { SubscriptionEntity } from '../entities/subscription.entity';

/**
 * Interface for subscription repository operations
 */
export interface ISubscriptionRepository {
  save(subscription: SubscriptionEntity): Promise<SubscriptionEntity>;
  findById(id: string): Promise<SubscriptionEntity | null>;
  findByUserId(id: string): Promise<SubscriptionEntity | null>;
  findByAllUserId(id: string): Promise<SubscriptionEntity[] | null>;
  findAllUncanceledSubscriptions(
    id: string,
  ): Promise<SubscriptionEntity[] | null>;
  findByStripeId(id: string): Promise<SubscriptionEntity | null>;
  update(
    id: string,
    data: Partial<SubscriptionEntity>,
  ): Promise<SubscriptionEntity | null>;
}
