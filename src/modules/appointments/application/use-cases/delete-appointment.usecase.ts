import {
  Logger,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { UserEntity } from '@modules/users/domain/entities/user.entity';
import {
  APPOINTMENT_REPOSITORY_TOKEN,
  IAppointmentRepository,
} from '@modules/appointments/domain/repositories/appointments.repository';

export class DeleteAppointmentUseCase {
  private logger = new Logger(DeleteAppointmentUseCase.name);

  constructor(
    @Inject(APPOINTMENT_REPOSITORY_TOKEN)
    private readonly appointmentRepository: IAppointmentRepository
  ) {}

  async execute(user: UserEntity, appointmentId: string) {
    this.logger.log(
      `Deleting the appointment ${appointmentId} for user ${user.id}`
    );

    const appointment =
      await this.appointmentRepository.findById(appointmentId);

    if (!appointment) {
      throw new NotFoundException(
        `No appointments were found with the ID ${appointmentId}`
      );
    }

    if (!appointment.isOwner(user)) {
      this.logger.warn(
        `The appointment ${user.id} was trying to delete the appointment ${appointmentId}`
      );
      throw new ForbiddenException(
        `You don't have permissions to delete this appointment`
      );
    }

    if (!appointment.canBeDeleted()) {
      this.logger.warn(
        `User ${user.id} tried to delete appointment ${appointmentId} within 24 hours of scheduled time`
      );
      throw new BadRequestException(
        `Appointments cannot be deleted within 24 hours of the scheduled time`
      );
    }

    await this.appointmentRepository.delete(appointmentId);
  }
}
