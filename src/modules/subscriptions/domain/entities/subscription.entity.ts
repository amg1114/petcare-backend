import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { SubscriptionPlan } from '../value-objects/subscription-plan.vo';
import { SubscriptionStatus } from '../value-objects/subscription-status.vo';

export interface SubscriptionEntityProps {
  id?: string;
  user: UserEntity;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeSubscriptionId: string;
  startAt: Date;
  endAt: Date;
  cancelAtEnd?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

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

  private constructor(props: SubscriptionEntityProps) {
    this.id = props.id;
    this.user = props.user;
    this.plan = props.plan;
    this.status = props.status;
    this.stripeSubscriptionId = props.stripeSubscriptionId;
    this.startAt = props.startAt;
    this.endAt = props.endAt;
    this.cancelAtEnd = props.cancelAtEnd ?? false;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Create a new subscription (without ID)
   */
  static create(
    props: Omit<SubscriptionEntityProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): SubscriptionEntity {
    return new SubscriptionEntity({
      ...props,
      id: undefined,
    });
  }

  /**
   * Reconstitute a subscription from the database (with ID)
   */
  static reconstitute(props: SubscriptionEntityProps): SubscriptionEntity {
    if (!props.id) {
      throw new Error('ID is required to reconstitute a subscription');
    }
    return new SubscriptionEntity(props);
  }

  get isActive() {
    return this.status === SubscriptionStatus.ACTIVE;
  }

  get isCanceled() {
    return this.status === SubscriptionStatus.CANCELED;
  }

  get canReactivate() {
    return !this.isCanceled && this.cancelAtEnd && this.endAt > new Date();
  }

  cancel() {
    if (this.isCanceled) return;

    this.status = SubscriptionStatus.CANCELED;
  }

  reactivate() {
    if (!this.canReactivate) {
      throw new Error('This subscription cannot be reactivated');
    }

    this.cancelAtEnd = false;
  }
}
