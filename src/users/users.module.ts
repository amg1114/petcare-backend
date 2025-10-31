import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserORMEntity } from './infrastructure/orm/user.orm-entity';
import { UsersController } from './presentation/controllers/users.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { UserORMRepository } from './infrastructure/repositories/user.orm-repository';
import { UpdateUserUseCase } from './application/use-cases/update-user.usecase';
import { DeleteUserUseCase } from './application/use-cases/delete-user.usecase';
import { GetUserUseCase } from './application/use-cases/get-user.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([UserORMEntity])],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserORMRepository,
    },
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetUserUseCase,
  ],
  controllers: [UsersController],
  exports: [],
})
export class UsersModule {}
