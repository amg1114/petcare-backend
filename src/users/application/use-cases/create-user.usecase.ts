import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/domain/repositories/user.repository';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UserEntity } from 'src/users/domain/entities/user.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: CreateUserDTO) {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = UserEntity.create(dto);

    return this.userRepository.save(user);
  }
}
