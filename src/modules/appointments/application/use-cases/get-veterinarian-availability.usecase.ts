import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@modules/users/domain/repositories/user.repository';
import { VeterinarianAvailabilityService } from '@modules/appointments/domain/services/veterinarian-availability.service';
import {
  APPOINTMENT_REPOSITORY_TOKEN,
  IAppointmentRepository,
} from '@modules/appointments/domain/repositories/appointments.repository';

import { VeterinarianAvailableSlotsDTO } from '@modules/appointments/application/dto/veterinarian-available-slots.dto';

@Injectable()
export class GetVeterinarianAvailabilityUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly usersRepository: IUserRepository,
    @Inject(APPOINTMENT_REPOSITORY_TOKEN)
    private readonly appointmentsRepository: IAppointmentRepository
  ) {}

  async execute(vetId: string, requestedDate: Date) {
    const veterinarian = await this.usersRepository.findVeterinarianById(vetId);

    if (!veterinarian) {
      throw new NotFoundException(
        `No veterinarians were found with the ID ${vetId}`
      );
    }

    const appointments =
      (await this.appointmentsRepository.getVeterinarianUpcomingAppointments(
        vetId
      )) ?? [];

    // Filter appointments to only those on the requested date
    const filteredAppointments = appointments.filter(
      (appointment) =>
        new Date(appointment.scheduledAt).toDateString() ===
        requestedDate.toDateString()
    );

    const availableSlots =
      VeterinarianAvailabilityService.calculateAvailableSlots(
        filteredAppointments,
        requestedDate
      );

    const availability = new VeterinarianAvailableSlotsDTO();

    availability.veterinarianId = veterinarian.id;
    availability.date = requestedDate;
    availability.availableSlots = availableSlots;
    availability.totalSlots = availableSlots.length;

    return availability;
  }
}
