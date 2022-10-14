import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  static expectedUsername = 'Canal-plus';
  static expectedPassword = 'Super-secret';
  private validTokens: Set<string> = new Set();

  login(user: string, password: string): { token: string } | { err: string } {
    if (user !== AuthService.expectedUsername) return { err: 'Wrong username' };
    if (password !== AuthService.expectedPassword)
      return { err: 'Wrong password' };
    const token = randomUUID();
    this.validTokens.add(token);
    return { token };
  }

  checkToken(token: string): boolean {
    return this.validTokens.has(token)
  }
}
