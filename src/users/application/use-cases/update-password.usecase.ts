import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/domain/repositories/user.repository';
import { UpdatePasswordDTO } from '../dto/update-password.dto';
import { IPasswordService } from 'src/shared/domain/services/password.service.interface';

@Injectable()
export class UpdatePasswordUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('PasswordService')
    private readonly passwordService: IPasswordService,
  ) {}

  async execute(userId: string, data: UpdatePasswordDTO): Promise<void> {
    const { password: currentPassword } =
      await this.userRepository.findById(userId);

    const passwordMatch = await this.passwordService.compare(
      data.currentPassword,
      currentPassword,
    );

    if (!passwordMatch)
      throw new BadRequestException('The user passwords dont match');

    const hashedNewPassword = await this.passwordService.hash(data.newPassword);

    await this.userRepository.update(userId, {
      password: hashedNewPassword,
    });
  }
}
