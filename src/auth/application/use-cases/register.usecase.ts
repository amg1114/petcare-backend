import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PasswordService } from 'src/auth/infrastructure/services/password.service';
import { UserEntity } from 'src/users/domain/entities/user.entity';
import { UserRepository } from 'src/users/domain/repositories/user.repository';
import { RegisterDTO } from '../dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDTO } from '../dto/auth-response.dto';

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
    const user = UserEntity.create({ ...data, password: hashedPassword });

    const payload = {
      sub: user.id,
      email: user.email,
      type: user.type,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
