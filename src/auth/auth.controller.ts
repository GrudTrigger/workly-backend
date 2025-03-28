import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Response } from 'express';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh-auth.guard';
import { User } from '@prisma/client';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign_up')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  async signUp(
    @Body() dto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.signUp(dto, response);
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign_in')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  async signIn(
    @CurrentUser() user: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.signIn(user, response);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @ApiOperation({ summary: 'Обновления токена' })
  async refreshToken(
    @CurrentUser() user: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.signIn(user, response);
  }
}
