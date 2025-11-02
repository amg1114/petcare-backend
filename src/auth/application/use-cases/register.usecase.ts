import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PasswordService } from 'src/auth/infrastructure/services/password.service';
import { UserEntity } from 'src/users/domain/entities/user.entity';
import { UserRepository } from 'src/users/domain/repositories/user.repository';
import { RegisterDTO } from '../dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDTO } from '../dto/auth-response.dto';
import { UserMapper } from 'src/users/infrastructure/mappers/user.mapper';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('PasswordService')
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(data: RegisterDTO): Promise<AuthResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.passwordService.hash(data.password);
    const newUser = UserEntity.create({ ...data, password: hashedPassword });
    const user = await this.userRepository.save(newUser);

    const payload: IJwtPayload = {
      sub: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: UserMapper.toDTO(user),
    };
  }
}
