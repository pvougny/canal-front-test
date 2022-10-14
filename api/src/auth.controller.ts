import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  service: AuthService;
  constructor(service: AuthService) {
    this.service = service;
  }

  @Post("/login")
  login(@Body() body: LoginBody, @Res() res: Response) {
    const result = this.service.login(body.username, body.password);
    if ('err' in result) return res.status(HttpStatus.UNAUTHORIZED).json(result);
    return res.json(result);
  }
}

interface LoginBody {
  username: string;
  password: string;
}
