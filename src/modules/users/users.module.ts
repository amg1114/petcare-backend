import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { USER_REPOSITORY_TOKEN } from '@modules/users/domain/repositories/user.repository';

import { GetUserUseCase } from '@modules/users/application/use-cases/users/get-user.usecase';
import { DeleteUserUseCase } from '@modules/users/application/use-cases/users/delete-user.usecase';
import { UpdateUserUseCase } from '@modules/users/application/use-cases/users/update-user.usecase';
import { UpdatePasswordUseCase } from '@modules/users/application/use-cases/users/update-password.usecase';
import { GetVeterinariansUseCase } from '@modules/users/application/use-cases/veterinarians/get-veterinarians.usecase';

import { UserORMEntity } from '@modules/users/infrastructure/orm/user.orm-entity';
import { UserORMRepository } from '@modules/users/infrastructure/repositories/user.orm-repository';

import { UsersController } from '@modules/users/presentation/controllers/users.controller';
import { VeterinariansController } from '@modules/users/presentation/controllers/veterinarians.controller';

import { SharedModule } from '@modules/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserORMEntity]), SharedModule],
  providers: [
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserORMRepository,
    },
    // Base Users
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetUserUseCase,
    UpdatePasswordUseCase,

    // Veterinarians
    GetVeterinariansUseCase,
  ],
  controllers: [UsersController, VeterinariansController],
  exports: ['UserRepository'],
})
export class UsersModule {}
