import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHasherService {
  /**
   * Number of salt rounds for hashing passwords.
   */
  private readonly SALT_ROUNDS: number;

  constructor(private readonly configService: ConfigService) {
    this.SALT_ROUNDS = this.configService.getOrThrow<number>(
      'BCRYPT_SALT_ROUNDS',
      10,
    );
  }

  /**
   * Hashes a given password using bcrypt.
   * @param password The password string to be hashed
   * @returns The hashed password
   */
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compares a clean password with a hashed password.
   * @param password The clean password to be compared with
   * @param hash The hashed password to be compared with
   * @returns The passwords match result
   */
  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
