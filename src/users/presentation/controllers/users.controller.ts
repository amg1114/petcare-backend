import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/application/dto/create-user.dto';
import { CreateUserUseCase } from 'src/users/application/use-cases/create-user.usecase';
import { UserMapper } from 'src/users/infrastructure/mappers/user.mapper';

@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserDTO) {
    const user = await this.createUserUseCase.execute(dto);

    return UserMapper.toDTO(user);
  }
}
