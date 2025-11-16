import { AppointmentEntity } from '@modules/appointments/domain/entities/appointment.entity';

/**
 * Appointment Repostory token for dependency injection
 */
export const APPOINTMENT_REPOSITORY_TOKEN = 'AppointmentRepository';

/**
 * Interface for appointment repository operations
 */
export interface IAppointmentRepository {
  save(appointment: AppointmentEntity): Promise<AppointmentEntity>;

  findById(appointmentId: string): Promise<AppointmentEntity | null>;

  findByVetIdAndDate(
    vetId: string,
    scheduledAt: Date
  ): Promise<AppointmentEntity[] | null>;

  getUserPetAppointments(userId: string): Promise<AppointmentEntity[] | null>;

  getVeterinarianAppointments(
    vetId: string
  ): Promise<AppointmentEntity[] | null>;

  delete(appointmentId: string): Promise<void>;
}
