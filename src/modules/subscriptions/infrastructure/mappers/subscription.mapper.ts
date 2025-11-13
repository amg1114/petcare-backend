import { SubscriptionEntity } from '@modules/subscriptions/domain/entities/subscription.entity';

import { SubscriptionResponseDTO } from '@modules/subscriptions/application/dto/subscription-response.dto';

import { UserMapper } from '@modules/users/infrastructure/mappers/user.mapper';

import { SubscriptionORMEntity } from '../orm/subscription.orm-entity';

export class SubscriptionMapper {
  static toDomain(ormEntity: SubscriptionORMEntity): SubscriptionEntity {
    if (!ormEntity.user) {
      throw new Error(
        "Subscription's user is required to map orm entity to a domain instance"
      );
    }

    const user = UserMapper.toDomain(ormEntity.user);

    return SubscriptionEntity.reconstitute({
      ...ormEntity,
      user,
    });
  }

  static toDTO(entity: SubscriptionEntity) {
    const dto = new SubscriptionResponseDTO();

    dto.id = entity.id;
    dto.plan = entity.plan;
    dto.status = entity.status;
    dto.cancelAtEnd = entity.cancelAtEnd;
    dto.startAt = entity.startAt;
    dto.endAt = entity.endAt;
    dto.createdAt = entity.createdAt;

    return dto;
  }
}
