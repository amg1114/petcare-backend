import { PetEntity } from '@modules/pets/domain/entities/pet.entity';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { ServiceType } from '@modules/appointments/domain/value-objects/service-type.vo';

interface AppointmentEntityProps {
  id: string;
  pet: PetEntity;
  scheduledAt: Date;
  serviceType: ServiceType;
  veterinarian: UserEntity;
  duration: number;
  notes?: string;
  createdAt?: Date;
}

export class AppointmentEntity {
  id: string;
  pet: PetEntity;
  scheduledAt: Date;
  serviceType: ServiceType;
  veterinarian?: UserEntity;
  duration: number;
  notes?: string;
  createdAt?: Date;

  private constructor(props: AppointmentEntityProps) {
    this.id = props.id;
    this.pet = props.pet;
    this.scheduledAt = props.scheduledAt;
    this.serviceType = props.serviceType;
    this.veterinarian = props.veterinarian;
    this.duration = props.duration;
    this.notes = props.notes;
    this.createdAt = props.createdAt;
  }

  static create(props: Omit<AppointmentEntityProps, 'id' | 'createdAt'>) {
    return new AppointmentEntity({
      ...props,
      id: undefined,
      createdAt: new Date(),
    });
  }

  static reconstitute(props: AppointmentEntityProps) {
    if (!props.id) {
      throw new Error('ID is required to reconstitute an appointment');
    }

    return new AppointmentEntity(props);
  }

  isOwner(user: UserEntity) {
    return this.pet.isOwner(user);
  }

  canBeDeleted(): boolean {
    const now = new Date();
    const hoursUntil =
      (this.scheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntil >= 24;
  }

  canBeReScheduled(): boolean {
    const now = new Date();
    const hoursUntil =
      (this.scheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntil >= 24;
  }
}
