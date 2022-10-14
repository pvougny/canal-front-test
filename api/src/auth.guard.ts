import { CanActivate, ExecutionContext, Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const authHeader = req.headers["authorization"];

    if (!authHeader?.startsWith("Bearer ")) return false;
    const token = authHeader?.substring(7, authHeader?.length); 

    return this.authService.checkToken(token)
  }
}
