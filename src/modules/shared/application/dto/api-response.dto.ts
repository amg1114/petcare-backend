import { ApiProperty } from '@nestjs/swagger';

export class ApiSuccessResponseDto<T> {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful',
  })
  success: boolean;

  @ApiProperty({ example: 200, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({
    example: '2025-10-26T10:30:00.000Z',
    description: 'Response timestamp',
  })
  timestamp: string;

  @ApiProperty({ description: 'Response data' })
  data: T;
}

export class ApiErrorResponseDto {
  @ApiProperty({
    example: false,
    description: 'Indicates if the request was successful',
  })
  success: boolean;

  @ApiProperty({ example: 'Error message', description: 'Error message' })
  message: string;

  @ApiProperty({
    example: '2025-10-26T10:30:00.000Z',
    description: 'Response timestamp',
  })
  timestamp: string;

  @ApiProperty({ example: '/api/users/123', description: 'Request path' })
  path: string;

  @ApiProperty({ required: false, description: 'Additional error details' })
  details?: any;
}
