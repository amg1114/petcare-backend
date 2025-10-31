import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserORMEntity } from './infrastructure/orm/user.orm-entity';
import { UsersController } from './presentation/controllers/users.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { UserORMRepository } from './infrastructure/repositories/user.orm-repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserORMEntity])],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserORMRepository,
    },
    CreateUserUseCase,
  ],
  controllers: [UsersController],
  exports: [],
})
export class UsersModule {}
