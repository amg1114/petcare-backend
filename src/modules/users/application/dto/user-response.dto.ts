import { ApiProperty, ApiSchema } from '@nestjs/swagger';

import { UserType } from '@modules/users/domain/value-objects/user-type.enum';

@ApiSchema({
  description: 'Data Transfer Object for user response',
})
export class UserResponseDTO {
  @ApiProperty({ description: 'Unique identifier of the user' })
  id: string;

  @ApiProperty({ description: 'Email address of the user' })
  email: string;

  @ApiProperty({ description: 'Name of the user' })
  name: string;

  @ApiProperty({ description: 'Phone number of the user' })
  phone: string;

  @ApiProperty({ description: 'Type of the user' })
  type: UserType;

  @ApiProperty({ description: 'Creation date of the user' })
  createdAt: Date;
}
