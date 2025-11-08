import { UserEntity } from 'src/users/domain/entities/user.entity';
import { SubscriptionPlan } from '../value-objects/subscription-plan.vo';
import { SubscriptionStatus } from '../value-objects/subscription-status.vo';

export class SubscriptionEntity {
  id: string;
  user: UserEntity;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeSubscriptionId: string;
  startAt: Date;
  endAt: Date;
  cancelAtEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}
