import { SubscriptionEntity } from 'src/subscriptions/domain/entities/subscription.entity';
import { SubscriptionORMEntity } from '../orm/subscription.orm-entity';
import { UserMapper } from 'src/users/infrastructure/mappers/user.mapper';

export class SubscriptionMapper {
  static toDomain(ormEntity: SubscriptionORMEntity): SubscriptionEntity {
    if (!ormEntity.user) {
      throw new Error(
        "Subscription's user is required to map orm entity to a domain instance",
      );
    }

    const user = UserMapper.toDomain(ormEntity.user);

    return SubscriptionEntity.reconstitute({
      ...ormEntity,
      user,
    });
  }
}
