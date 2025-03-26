import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign_up')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  async signUp(@Body() dto: RegisterUserDto) {
    return await this.authService.signUp(dto);
  }

  @Post('sign_in')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  async signIn(@Body() dto: LoginUserDto) {
    return await this.authService.signIn(dto);
  }
}
