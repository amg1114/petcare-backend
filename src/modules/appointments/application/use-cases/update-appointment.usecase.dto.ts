import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { AppointmentEntity } from '@modules/appointments/domain/entities/appointment.entity';
import { ServiceDuration } from '@modules/appointments/domain/value-objects/service-duration.vo';
import {
  USER_REPOSITORY_TOKEN,
  IUserRepository,
} from '@modules/users/domain/repositories/user.repository';
import {
  ServiceType,
  VETERINARIAN_SERVICES,
} from '@modules/appointments/domain/value-objects/service-type.vo';
import { VeterinarianAvailabilityService } from '@modules/appointments/domain/services/veterinarian-availability.service';
import {
  APPOINTMENT_REPOSITORY_TOKEN,
  IAppointmentRepository,
} from '@modules/appointments/domain/repositories/appointments.repository';

import { UpdateAppointmentDTO } from '@modules/appointments/application/dto/update-appointment.dto';

import { AppointmentMapper } from '@modules/appointments/infrastructure/mappers/appointment.mapper';

export class UpdateAppointmentUseCase {
  private logger = new Logger(UpdateAppointmentUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(APPOINTMENT_REPOSITORY_TOKEN)
    private readonly appointmentRepository: IAppointmentRepository
  ) {}

  async execute(
    user: UserEntity,
    appointmentId: string,
    dto: UpdateAppointmentDTO
  ) {
    this.logger.log(`Updating appointment with ID: ${appointmentId}`);

    let appointment = await this.appointmentRepository.findById(appointmentId);

    if (!appointment) {
      throw new NotFoundException(
        `No appointment was found with the ID: ${appointmentId}`
      );
    }

    if (!appointment.isOwner(user)) {
      this.logger.warn(
        `The user with ID ${user.id} was trying to update the appointment ${appointment.id}`
      );
      throw new ForbiddenException(
        `You don't have permissions to update this appointment`
      );
    }

    const duration = ServiceDuration.fromService(dto.serviceType);
    let veterinarian: UserEntity | undefined;

    if (this.requiresVeterinarian(dto.serviceType)) {
      veterinarian = await this.validateAndGetVeterinarian(dto.vetId);

      await this.validateVeterinarianAvailability(
        veterinarian.id,
        dto.scheduledAt,
        duration,
        appointment.id
      );
    }

    appointment = AppointmentEntity.reconstitute({
      ...appointment,
      ...dto,
      duration,
      veterinarian,
    });

    appointment = await this.appointmentRepository.save(appointment);

    return AppointmentMapper.toDto(appointment);
  }

  private requiresVeterinarian(type: ServiceType): boolean {
    return VETERINARIAN_SERVICES.includes(type);
  }

  private async validateAndGetVeterinarian(vetId: string | undefined) {
    if (!vetId) {
      throw new BadRequestException(
        `You need to provide a veterinarian ID for this service`
      );
    }

    const veterinarian = await this.userRepository.findVeterinarianById(vetId);

    if (!veterinarian) {
      throw new NotFoundException(
        `The requested veterinarian with ID: ${vetId} was not found`
      );
    }

    return veterinarian;
  }

  private async validateVeterinarianAvailability(
    vetId: string,
    scheduledAt: Date,
    duration: number,
    excludeAppointmentId?: string
  ) {
    let existingAppointments =
      await this.appointmentRepository.findByVetIdAndDate(vetId, scheduledAt);

    if (excludeAppointmentId) {
      existingAppointments = existingAppointments.filter(
        (appt) => appt.id !== excludeAppointmentId
      );
    }

    const conflicts =
      VeterinarianAvailabilityService.getConflictingAppointments(
        existingAppointments,
        scheduledAt,
        duration
      );

    if (conflicts.length) {
      throw new BadRequestException(
        `Veterinarian is not available at ${scheduledAt.toISOString()}. ` +
          `Conflicting appointment at ${conflicts[0].scheduledAt.toISOString()}`
      );
    }
  }
}
