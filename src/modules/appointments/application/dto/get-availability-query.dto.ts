import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, MinDate } from 'class-validator';

import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description: 'Get availability query data transfer object',
})
export class GetAvailabilityQueryDto {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date(), { message: 'Date cannot be in the past' })
  @ApiProperty({
    description: 'Date to check availability (ISO 8601 format)',
    example: '2025-11-16',
    type: String,
  })
  date: Date; // Automatically converts string to Date
}
