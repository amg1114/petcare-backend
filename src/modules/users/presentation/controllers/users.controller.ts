import { CurrentUser } from '@/modules/auth/infrastructure/decorators/current-user.decorator';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';

import { UpdateUserDTO } from '@modules/users/application/dto/update-user.dto';
import { UserResponseDTO } from '@modules/users/application/dto/user-response.dto';
import { UpdatePasswordDTO } from '@modules/users/application/dto/update-password.dto';
import { DeleteUserUseCase } from '@modules/users/application/use-cases/delete-user.usecase';
import { UpdateUserUseCase } from '@modules/users/application/use-cases/update-user.usecase';
import { UpdatePasswordUseCase } from '@modules/users/application/use-cases/update-password.usecase';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly updatePasswordUseCase: UpdatePasswordUseCase
  ) {}

  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update own user data' })
  async updateOwnUser(
    @CurrentUser() currentUser: UserResponseDTO,
    @Body() dto: UpdateUserDTO
  ) {
    return this.updateUserUseCase.execute(currentUser.id, dto);
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update own user Password' })
  async updatePassword(
    @CurrentUser() currentUser: UserResponseDTO,
    @Body() dto: UpdatePasswordDTO
  ) {
    return this.updatePasswordUseCase.execute(currentUser.id, dto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete own user data' })
  async deleteUser(@CurrentUser() currentUser: UserResponseDTO) {
    return this.deleteUserUseCase.execute(currentUser.id);
  }
}
