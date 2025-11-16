import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { AppointmentEntity } from '@modules/appointments/domain/entities/appointment.entity';
import { ServiceType } from '@modules/appointments/domain/value-objects/service-type.vo';
import { ServiceDuration } from '@modules/appointments/domain/value-objects/service-duration.vo';
import {
  IPetRepository,
  PET_REPOSITORY_TOKEN,
} from '@modules/pets/domain/repositories/pet.repository';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@modules/users/domain/repositories/user.repository';
import { VeterinarianAvailabilityService } from '@modules/appointments/domain/services/veterinarian-availability.service';
import {
  APPOINTMENT_REPOSITORY_TOKEN,
  IAppointmentRepository,
} from '@modules/appointments/domain/repositories/appointments.repository';

import { CreateAppointmentDTO } from '@modules/appointments/application/dto/create-appointment.dto';

import { AppointmentMapper } from '@modules/appointments/infrastructure/mappers/appointment.mapper';

@Injectable()
export class CreateAppointmentUseCase {
  private VETERINARIAN_SERVICES = [
    ServiceType.MEDICALREVIEW,
    ServiceType.FOLLOWUP,
  ];

  private logger = new Logger(CreateAppointmentUseCase.name);

  constructor(
    @Inject(PET_REPOSITORY_TOKEN)
    private readonly petRepository: IPetRepository,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(APPOINTMENT_REPOSITORY_TOKEN)
    private readonly appointmentRepository: IAppointmentRepository
  ) {}

  async execute(user: UserEntity, dto: CreateAppointmentDTO) {
    this.logger.log(`Creating a new appointment for pet ${dto.petId}`);

    const pet = await this.petRepository.findById(dto.petId);

    if (!pet) {
      this.logger.error(
        `Pet with id: ${dto.petId} was not found when creating an appointment`
      );

      throw new NotFoundException(`Pet with ID: ${dto.petId} was not found`);
    }

    if (!pet.isOwner(user)) {
      this.logger.warn(
        `User with id ${user.id} was trying to delete the pet with ID ${dto.petId}`
      );

      throw new ForbiddenException(
        `You don't have permissions to create an appointment for this pet`
      );
    }

    const duration = ServiceDuration.fromService(dto.serviceType);
    let veterinarian: UserEntity | undefined;

    if (this.requiresVeterinarian(dto.serviceType)) {
      veterinarian = await this.validateAndGetVeterinarian(dto.vetId);

      await this.validateVeterinarianAvailability(
        veterinarian.id,
        dto.scheduledAt,
        duration
      );
    }

    let appointment = AppointmentEntity.create({
      ...dto,
      pet,
      veterinarian,
      duration,
    });

    appointment = await this.appointmentRepository.save(appointment);

    return AppointmentMapper.toDto(appointment);
  }

  private requiresVeterinarian(type: ServiceType): boolean {
    return this.VETERINARIAN_SERVICES.includes(type);
  }

  private async validateAndGetVeterinarian(vetId: string | undefined) {
    if (!vetId) {
      throw new BadRequestException(
        `You need to provide a veterinarian ID for this service`
      );
    }

    const veterinarian = await this.userRepository.findById(vetId);

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
    duration: number
  ) {
    const existingAppointments =
      await this.appointmentRepository.findByVetIdAndDate(vetId, scheduledAt);

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
