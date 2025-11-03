import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/infrastructure/decorators/current-user.decorator';
import { UpdatePasswordDTO } from 'src/users/application/dto/update-password.dto';
import { UpdateUserDTO } from 'src/users/application/dto/update-user.dto';
import { UserResponseDTO } from 'src/users/application/dto/user-response.dto';
import { DeleteUserUseCase } from 'src/users/application/use-cases/delete-user.usecase';
import { GetUserUseCase } from 'src/users/application/use-cases/get-user.usecase';
import { UpdatePasswordUseCase } from 'src/users/application/use-cases/update-password.usecase';
import { UpdateUserUseCase } from 'src/users/application/use-cases/update-user.usecase';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updatePasswordUseCase: UpdatePasswordUseCase,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the user to retrieve' })
  async getUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.getUserUseCase.execute(id);
  }

  @Patch('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update the user Password' })
  async updatePassword(
    @CurrentUser() currentUser: UserResponseDTO,
    @Body() dto: UpdatePasswordDTO,
  ) {
    return this.updatePasswordUseCase.execute(currentUser.id, dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({ name: 'id', description: 'UUID of the user to update' })
  async updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateUserDTO,
  ) {
    return this.updateUserUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'UUID of the user to delete' })
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.deleteUserUseCase.execute(id);
  }
}
