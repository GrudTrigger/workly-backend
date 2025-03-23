import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign_up')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  async signUp(@Body() dto: RegisterUserDto) {
    return this.authService.signUp(dto);
  }

  @Post('sign_in')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  async signIn(@Body() dto: LoginUserDto) {
    return this.authService.signIn(dto);
  }
}
