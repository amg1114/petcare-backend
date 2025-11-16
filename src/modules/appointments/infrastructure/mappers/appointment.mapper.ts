import { AppointmentEntity } from '@modules/appointments/domain/entities/appointment.entity';

import { AppointmentResponseDTO } from '@modules/appointments/application/dto/appointment-response.dto';

import { PetMapper } from '@modules/pets/infrastructure/mappers/pet.mapper';
import { UserMapper } from '@modules/users/infrastructure/mappers/user.mapper';
import { AppointmentORMEntity } from '@modules/appointments/infrastructure/orm/appointment.orm-entity';

export class AppointmentMapper {
  static toDomain(ormEntity: AppointmentORMEntity) {
    if (!ormEntity.pet) {
      throw new Error(
        "Appointment's pet is required to map orm entity to a domain instance"
      );
    }

    const pet = PetMapper.toDomain(ormEntity.pet);

    return AppointmentEntity.reconstitute({
      ...ormEntity,
      pet,
      veterinarian: ormEntity.veterinarian
        ? UserMapper.toDomain(ormEntity.veterinarian)
        : undefined,
    });
  }

  static toDto(domainEntity: AppointmentEntity) {
    const dto = new AppointmentResponseDTO();

    dto.id = domainEntity.id;

    dto.pet = PetMapper.toDTO(domainEntity.pet);

    dto.scheduledAt = domainEntity.scheduledAt;

    dto.serviceType = domainEntity.serviceType;

    dto.veterinarian = domainEntity.veterinarian
      ? UserMapper.toDTO(domainEntity.veterinarian)
      : undefined;

    dto.duration = domainEntity.duration;

    dto.notes = domainEntity.notes;

    dto.createdAt = domainEntity.createdAt;

    return dto;
  }
}
