import { Injectable } from '@nestjs/common';

import { AppointmentEntity } from '@modules/appointments/domain/entities/appointment.entity';

@Injectable()
export class VeterinarianAvailabilityService {
  static calculateAppointmentEnd(
    requestedStart: Date,
    requestedDuration: number // in hours
  ) {
    return new Date(
      requestedStart.getTime() + requestedDuration * 60 * 60 * 1000
    );
  }

  static getConflictingAppointments(
    existingAppointments: AppointmentEntity[],
    requestedStart: Date,
    requestedDuration: number // in hours
  ): AppointmentEntity[] {
    const requestedEnd =
      VeterinarianAvailabilityService.calculateAppointmentEnd(
        requestedStart,
        requestedDuration
      );

    return existingAppointments.filter((appointment) => {
      const appointmentStart = appointment.scheduledAt;
      const appointmentEnd =
        VeterinarianAvailabilityService.calculateAppointmentEnd(
          appointment.scheduledAt,
          appointment.duration
        );

      return (
        (requestedStart >= appointmentStart &&
          requestedStart < appointmentEnd) ||
        (requestedEnd > appointmentStart && requestedEnd <= appointmentEnd) ||
        (requestedStart <= appointmentStart && requestedEnd >= appointmentEnd)
      );
    });
  }
}
