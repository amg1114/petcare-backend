import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';

import { UserEntity } from '@modules/users/domain/entities/user.entity';

import { UpdateUserDTO } from '@modules/users/application/dto/update-user.dto';
import { UpdatePasswordDTO } from '@modules/users/application/dto/update-password.dto';
import { DeleteUserUseCase } from '@modules/users/application/use-cases/users/delete-user.usecase';
import { UpdateUserUseCase } from '@modules/users/application/use-cases/users/update-user.usecase';
import { UpdatePasswordUseCase } from '@modules/users/application/use-cases/users/update-password.usecase';

import { CurrentUser } from '@modules/auth/infrastructure/decorators/current-user.decorator';

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
    @CurrentUser() currentUser: UserEntity,
    @Body() dto: UpdateUserDTO
  ) {
    return this.updateUserUseCase.execute(currentUser.id, dto);
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update own user Password' })
  async updatePassword(
    @CurrentUser() currentUser: UserEntity,
    @Body() dto: UpdatePasswordDTO
  ) {
    return this.updatePasswordUseCase.execute(currentUser.id, dto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete own user data' })
  async deleteUser(@CurrentUser() currentUser: UserEntity) {
    return this.deleteUserUseCase.execute(currentUser.id);
  }
}
