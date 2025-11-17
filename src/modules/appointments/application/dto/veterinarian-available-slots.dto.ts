import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description: 'Veterinarian available slot data transfer object',
})
export class VeterinarianAvailableSlotsDTO {
  @ApiProperty({
    description: 'The unique identifier of the veterinarian',
    example: '987e6543-e21b-12d3-a456-426614174001',
  })
  veterinarianId: string;

  @ApiProperty({
    description: 'The date for which the available slots are available',
    example: '2024-03-15T10:30:00Z',
  })
  date: Date;

  @ApiProperty({
    description: 'The available slot dates',
    example: ['2025-11-16T08:00:00.000Z', '2025-11-16T08:30:00.000Z'],
  })
  availableSlots: string[];

  @ApiProperty({
    description: 'The total number of available slots',
    example: 2,
  })
  totalSlots: number;
}
