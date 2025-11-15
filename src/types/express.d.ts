import { SubscriptionEntity } from 'src/modules/subscriptions/domain/entities/subscription.entity';

import { UserEntity } from '@modules/users/domain/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user: UserEntity;
      subscription?: SubscriptionEntity;
    }
  }
}
