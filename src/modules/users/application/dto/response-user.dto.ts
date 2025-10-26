import { Exclude, Expose } from 'class-transformer';
import { UserType } from '../../domain/enums/user-type.enum';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@Exclude()
@ApiSchema({
  description: 'Data Transfer Object for user response',
})
export class UserResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'Email of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @Expose()
  @ApiProperty({ description: 'Type of the user', example: UserType.CLIENTE })
  type: UserType;

  @Expose()
  @ApiProperty({
    description: 'Creation date of the user',
    example: new Date(),
  })
  createdAt: Date;
}
