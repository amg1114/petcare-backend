import { IsOptional } from 'class-validator';

import { ServiceType } from '@modules/appointments/domain/value-objects/service-type.vo';

import { IsValidAppointmentNotes } from '@modules/appointments/infrastructure/validators/appointment-notes.validator';
import { IsValidAppointmentPetId } from '@modules/appointments/infrastructure/validators/appointment-petid.validator';
import { IsValidAppointmentVetId } from '@modules/appointments/infrastructure/validators/appointment-vetid.validator';
import { IsValidAppointmentService } from '@modules/appointments/infrastructure/validators/apointment-service.validator';
import { IsValidAppointmentScheduledAt } from '@modules/appointments/infrastructure/validators/appointment-scheduledat.validator';

export class CreateAppointmentDTO {
  @IsValidAppointmentPetId()
  petId: string;

  @IsValidAppointmentScheduledAt()
  scheduledAt: Date;

  @IsValidAppointmentService()
  serviceType: ServiceType;

  @IsValidAppointmentVetId()
  @IsOptional()
  vetId?: string;

  @IsValidAppointmentNotes()
  @IsOptional()
  notes?: string;
}
