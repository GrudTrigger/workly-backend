import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { TokenUser } from '../../types/user-types';
import * as process from 'node:process';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.Refresh,
      ]),
      secretOrKey: process.env.SERCRET_REFRESH!,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenUser) {
    return this.authService.veryifyUserRefreshToken(
      request.cookies?.Refresh,
      payload.id,
    );
  }
}
