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

  /**
   * Get available 30-minute time slots for a given date during business hours (8 AM - 5 PM)
   * @param existingAppointments - All appointments for the veterinarian on that date
   * @param requestedDate - The date to check availability for
   * @returns Array of available time slots in ISO format
   */
  static calculateAvailableSlots(
    existingAppointments: AppointmentEntity[],
    requestedDate: Date
  ): string[] {
    const SLOT_DURATION_MINUTES = 30;
    const BUSINESS_START_HOUR = 8; // 8 AM
    const BUSINESS_END_HOUR = 17; // 5 PM
    const availableSlots: string[] = [];

    // Create date objects for business hours on the requested date using UTC
    const startTime = new Date(requestedDate);
    startTime.setUTCHours(BUSINESS_START_HOUR, 0, 0, 0);

    const endTime = new Date(requestedDate);
    endTime.setUTCHours(BUSINESS_END_HOUR, 0, 0, 0);

    // Generate all possible 30-minute slots
    let currentSlot = new Date(startTime);

    while (currentSlot < endTime) {
      const slotEnd = new Date(
        currentSlot.getTime() + SLOT_DURATION_MINUTES * 60 * 1000
      );

      // Check if this slot conflicts with any existing appointment
      const hasConflict = existingAppointments.some((appointment) => {
        const appointmentStart = appointment.scheduledAt;
        const appointmentEnd =
          VeterinarianAvailabilityService.calculateAppointmentEnd(
            appointment.scheduledAt,
            appointment.duration
          );

        // Check if slot overlaps with appointment
        return currentSlot < appointmentEnd && slotEnd > appointmentStart;
      });

      // If no conflict, add to available slots
      if (!hasConflict) {
        availableSlots.push(currentSlot.toISOString());
      }

      // Move to next 30-minute slot
      currentSlot = new Date(
        currentSlot.getTime() + SLOT_DURATION_MINUTES * 60 * 1000
      );
    }

    return availableSlots;
  }
}
