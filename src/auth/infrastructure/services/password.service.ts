import { Injectable } from '@nestjs/common';
import { IPasswordService } from 'src/auth/domain/services/password.service.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService implements IPasswordService {
  private readonly SALT_ROUNDS = '10';

  constructor() {}

  hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
