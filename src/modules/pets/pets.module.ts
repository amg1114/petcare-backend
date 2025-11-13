import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PET_REPOSITORY_TOKEN } from '@modules/pets/domain/repositories/pet.repository';

import { PetORMEntity } from '@modules/pets/infrastructure/orm/pet.orm-entity';
import { PetRepositoryImpl } from '@modules/pets/infrastructure/repositories/pet.repository-impl';

@Module({
  imports: [TypeOrmModule.forFeature([PetORMEntity])],
  providers: [
    {
      provide: PET_REPOSITORY_TOKEN,
      useClass: PetRepositoryImpl,
    },
  ],
  exports: [PET_REPOSITORY_TOKEN],
})
export class PetsModule {}
