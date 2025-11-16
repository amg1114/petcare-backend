import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { AppointmentEntity } from '@modules/appointments/domain/entities/appointment.entity';
import { SubscriptionEntity } from '@modules/subscriptions/domain/entities/subscription.entity';
import {
  APPOINTMENT_REPOSITORY_TOKEN,
  IAppointmentRepository,
} from '@modules/appointments/domain/repositories/appointments.repository';

import { AppointmentMapper } from '@modules/appointments/infrastructure/mappers/appointment.mapper';

@Injectable()
export class GetUserAppointmentsUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY_TOKEN)
    private readonly appointmentsRepository: IAppointmentRepository
  ) {}

  async execute(userId: string, currentSubscription: SubscriptionEntity) {
    let appointments: AppointmentEntity[] | null;

    if (currentSubscription.isProfessional) {
      appointments =
        await this.appointmentsRepository.getVeterinarianUpcomingAppointments(
          userId
        );
    } else {
      appointments =
        await this.appointmentsRepository.getUserPetUpcomingAppointments(
          userId
        );
    }

    if (!appointments) {
      throw new NotFoundException(`No pending appointments were found.`);
    }

    return appointments.map(AppointmentMapper.toDto);
  }
}
