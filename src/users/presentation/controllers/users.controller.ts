import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDTO } from 'src/users/application/dto/create-user.dto';
import { UpdateUserDTO } from 'src/users/application/dto/update-user.dto';
import { CreateUserUseCase } from 'src/users/application/use-cases/create-user.usecase';
import { DeleteUserUseCase } from 'src/users/application/use-cases/delete-user.usecase';
import { UpdateUserUseCase } from 'src/users/application/use-cases/update-user.usecase';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserDTO) {
    return this.createUserUseCase.execute(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateUserDTO,
  ) {
    return this.updateUserUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.deleteUserUseCase.execute(id);
  }
}
