import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PET_REPOSITORY_TOKEN } from '@modules/pets/domain/repositories/pet.repository';

import { GetPetUseCase } from '@modules/pets/application/use-cases/get-pet.usecase';
import { CreatePetUseCase } from '@modules/pets/application/use-cases/create-pet.usecase';
import { DeletePetUseCase } from '@modules/pets/application/use-cases/delete-pet.usecase';
import { UpdatePetUseCase } from '@modules/pets/application/use-cases/update-pet.usecase';
import { GetUserPetsUseCase } from '@modules/pets/application/use-cases/get-user-pets.usecase';

import { PetORMEntity } from '@modules/pets/infrastructure/orm/pet.orm-entity';
import { PetRepositoryImpl } from '@modules/pets/infrastructure/repositories/pet.repository-impl';

import { PetsController } from '@modules/pets/presentation/controllers/pets.controller';

import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([PetORMEntity]), UsersModule],
  providers: [
    {
      provide: PET_REPOSITORY_TOKEN,
      useClass: PetRepositoryImpl,
    },
    GetPetUseCase,
    CreatePetUseCase,
    DeletePetUseCase,
    UpdatePetUseCase,
    GetUserPetsUseCase,
  ],
  exports: [PET_REPOSITORY_TOKEN],
  controllers: [PetsController],
})
export class PetsModule {}
