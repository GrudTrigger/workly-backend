import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import * as process from 'node:process';
import { TokenUser } from '../types/user-types';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: RegisterUserDto, response: Response) {
    const existedUser = await this.userService.findUserByEmail(dto.email);
    if (existedUser) {
      throw new BadRequestException(
        'Пользователь с такими данными уже существует',
      );
    }
    const hashedPassword = await hash(dto.password);
    const user = {
      ...dto,
      password: hashedPassword,
    };
    const newUser = await this.userService.createUser(user);

    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(
      expiresAccessToken.getTime() +
        parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS!),
    );

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setMilliseconds(
      expiresRefreshToken.getTime() +
        parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS!),
    );

    const tokenPayload: TokenUser = {
      id: newUser.id,
    };
    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: process.env.SECRET!,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS}ms`,
    });
    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: process.env.SERCRET_REFRESH!,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS}ms`,
    });

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expiresAccessToken,
    });
    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expiresRefreshToken,
    });

    return {
      user_data: { ...newUser, password: undefined },
    };
  }

  async signIn(dto: LoginUserDto, response: Response) {
    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(
      expiresAccessToken.getTime() +
        parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS!),
    );

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setMilliseconds(
      expiresRefreshToken.getTime() +
        parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS!),
    );

    const user = await this.userService.findUserByEmail(dto.email);
    if (!user) {
      return;
    }
    const tokenPayload: TokenUser = {
      id: user.id,
    };
    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: process.env.SECRET!,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS}ms`,
    });
    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: process.env.SERCRET_REFRESH!,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS}ms`,
    });

    await this.userService.updateUser(user.id, refreshToken);

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expiresAccessToken,
    });
    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expiresRefreshToken,
    });
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.userService.findUserByEmail(email);
      if (!user) {
        throw new NotFoundException('Неверный email или пароль');
      }
      const authenticated = await verify(user.password, password);
      if (!authenticated) {
        throw new BadRequestException('Неверный email или пароль');
      }
      return user;
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }

  async veryifyUserRefreshToken(refreshToken: string, userId: number) {
    try {
      const user = await this.userService.findUserById(userId);
      if (!user) {
        return;
      }
      const authenticated = await verify(user.refresh_token!, refreshToken);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Не валидный refresh token');
    }
  }
}
