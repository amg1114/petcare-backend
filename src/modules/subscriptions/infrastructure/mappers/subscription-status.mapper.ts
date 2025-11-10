import { SubscriptionStatus } from '@modules/subscriptions/domain/value-objects/subscription-status.vo';
import Stripe from 'stripe';

export class SubscriptionStatusMapper {
  static fromStripe(status: Stripe.Subscription.Status): SubscriptionStatus {
    switch (status) {
      case 'active':
        return SubscriptionStatus.ACTIVE;

      case 'canceled':
        return SubscriptionStatus.CANCELED;

      case 'incomplete':
      case 'unpaid':
        return SubscriptionStatus.INCOMPLETE;

      case 'incomplete_expired':
      case 'past_due':
        return SubscriptionStatus.EXPIRED;

      default:
        throw new Error(
          "The stripe status value doesn't have an implemented mapper: " +
            status,
        );
    }
  }
}
