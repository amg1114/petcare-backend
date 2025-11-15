import { PetEntity } from '@modules/pets/domain/entities/pet.entity';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { ServiceType } from '@modules/appointments/domain/value-objects/service-type.vo';

interface ApointmentEntityProps {
  id: string;
  pet: PetEntity;
  scheduledAt: Date;
  serviceType: ServiceType;
  veterinarian: UserEntity;
  duration: number;
  notes: string;
  createdAt?: Date;
}

export class ApointmentEntity {
  id: string;
  pet: PetEntity;
  scheduledAt: Date;
  serviceType: ServiceType;
  veterinarian?: UserEntity;
  duration: number;
  notes: string | null;
  createdAt?: Date;

  private constructor(props: ApointmentEntityProps) {
    this.id = props.id;
    this.pet = props.pet;
    this.scheduledAt = props.scheduledAt;
    this.serviceType = props.serviceType;
    this.veterinarian = props.veterinarian;
    this.duration = props.duration;
    this.notes = props.notes;
    this.createdAt = props.createdAt;
  }

  static create(props: Omit<ApointmentEntityProps, 'id' | 'createdAt'>) {
    return new ApointmentEntity({
      ...props,
      id: undefined,
      createdAt: new Date(),
    });
  }

  static reconstitute(props: ApointmentEntityProps) {
    if (!props.id) {
      throw new Error('ID is required to reconstitute an appointment');
    }

    return new ApointmentEntity(props);
  }
}
