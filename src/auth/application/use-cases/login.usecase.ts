import { Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/auth/infrastructure/services/password.service';
import { UserRepository } from 'src/users/domain/repositories/user.repository';
import { LoginDTO } from '../dto/login.dto';
import { AuthResponseDTO } from '../dto/auth-response.dto';

export class LogiUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('PasswordService')
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async execute({ email, password }: LoginDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const matchPassword = await this.passwordService.compare(
      password,
      user.password,
    );

    if (!matchPassword) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
