import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

import { PetEntity } from '@modules/pets/domain/entities/pet.entity';
import { IPetRepository } from '@modules/pets/domain/repositories/pet.repository';

import { PetMapper } from '@modules/pets/infrastructure/mappers/pet.mapper';
import { PetORMEntity } from '@modules/pets/infrastructure/orm/pet.orm-entity';

/**
 * Implementation for Pet Repository with TypeORM
 */
@Injectable()
export class PetRepositoryImpl implements IPetRepository {
  private logger = new Logger('PetRepository');

  constructor(
    @InjectRepository(PetORMEntity)
    private readonly repository: Repository<PetORMEntity>
  ) {}

  async findById(id: string): Promise<PetEntity | null> {
    try {
      const petOrm = await this.repository.findOneBy({ id });

      if (!petOrm) return null;

      return PetMapper.toDomain(petOrm);
    } catch (error: any) {
      this.logger.error(`Error finding pet by ID ${id}: ${error.message}`);
      throw error;
    }
  }

  async findByOwnerId(ownerId: string): Promise<PetEntity[] | null> {
    try {
      const pets = await this.repository.find({
        where: { owner: { id: ownerId } },
        order: { name: 'asc', birthDate: 'asc' },
      });

      if (!pets.length) return null;

      return pets.map(PetMapper.toDomain);
    } catch (error: any) {
      this.logger.error(
        `Error finding pets by owner ID ${ownerId}: ${error.message}`
      );
      throw error;
    }
  }

  async save(pet: PetEntity): Promise<PetEntity> {
    try {
      if (!pet.id) {
        const newPet = this.repository.create(pet);
        const savedEntity = await this.repository.save(newPet);

        return PetMapper.toDomain(savedEntity);
      }

      const savedEntity = await this.repository.save(pet);
      return PetMapper.toDomain(savedEntity);
    } catch (error: any) {
      this.logger.error(
        `Error saving pet${pet.id ? ' with ID ' + pet.id : ''}: ${error.message}`
      );
      throw error;
    }
  }
}
