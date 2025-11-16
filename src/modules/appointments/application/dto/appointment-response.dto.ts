import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';

import { ServiceType } from '@modules/appointments/domain/value-objects/service-type.vo';

import { PetResponseDTO } from '@modules/pets/application/dto/pet-response.dto';
import { UserResponseDTO } from '@modules/users/application/dto/user-response.dto';

@ApiSchema({
  description: 'Response DTO containing appointment information',
})
export class AppointmentResponseDTO {
  @ApiProperty({
    description: 'Unique identifier for the appointment',
    example: 'a1b2c3d4-5f6g-7h8i-9j0k-lmnopqrstuv',
  })
  id: string;

  @ApiProperty({
    description: 'Pet associated with the appointment',
    type: PetResponseDTO,
  })
  pet: PetResponseDTO;

  @ApiProperty({
    description: 'Scheduled date and time for the appointment (ISO 8601)',
    example: '2025-02-28T14:30:00.000Z',
  })
  scheduledAt: Date;

  @ApiProperty({
    description: 'Type of service to be provided',
    enum: ServiceType,
    example: 'consultation',
  })
  serviceType: ServiceType;

  @ApiPropertyOptional({
    description: 'Assigned veterinarian for the appointment (if any)',
    type: UserResponseDTO,
  })
  veterinarian?: UserResponseDTO;

  @ApiProperty({
    description: 'Expected duration of the appointment in minutes',
    example: 30,
  })
  duration: number;

  @ApiPropertyOptional({
    description: 'Optional notes or instructions for the appointment',
    example:
      'Bring previous vaccination records; monitor appetite for 24 hours',
  })
  notes?: string;

  @ApiProperty({
    description: 'Timestamp when the appointment was created (ISO 8601)',
    example: '2025-02-01T09:15:00.000Z',
  })
  createdAt: Date;
}
