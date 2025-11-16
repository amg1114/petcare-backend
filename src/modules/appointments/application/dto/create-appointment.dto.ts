import { IsOptional } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { ServiceType } from '@modules/appointments/domain/value-objects/service-type.vo';

import { IsValidAppointmentNotes } from '@modules/appointments/infrastructure/validators/appointment-notes.validator';
import { IsValidAppointmentPetId } from '@modules/appointments/infrastructure/validators/appointment-petid.validator';
import { IsValidAppointmentVetId } from '@modules/appointments/infrastructure/validators/appointment-vetid.validator';
import { IsValidAppointmentService } from '@modules/appointments/infrastructure/validators/apointment-service.validator';
import { IsValidAppointmentScheduledAt } from '@modules/appointments/infrastructure/validators/appointment-scheduledat.validator';

export class CreateAppointmentDTO {
  @IsValidAppointmentPetId()
  @ApiProperty({
    description: 'The unique identifier of the pet for this appointment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  petId: string;

  @IsValidAppointmentScheduledAt()
  @ApiProperty({
    description: 'The date and time when the appointment is scheduled',
    example: '2024-03-15T10:30:00Z',
  })
  scheduledAt: Date;

  @IsValidAppointmentService()
  @ApiProperty({
    description: 'The type of service requested for the appointment',
    enum: ServiceType,
    example: ServiceType.MEDICALREVIEW,
  })
  serviceType: ServiceType;

  @IsValidAppointmentVetId()
  @IsOptional()
  @ApiProperty({
    description:
      'The unique identifier of the veterinarian assigned to this appointment (optional)',
    example: '987e6543-e21b-12d3-a456-426614174001',
  })
  vetId?: string;

  @IsValidAppointmentNotes()
  @IsOptional()
  @ApiProperty({
    description:
      'Additional notes or comments about the appointment (optional)',
    example: 'Pet has been showing signs of lethargy and decreased appetite',
  })
  notes?: string;
}
