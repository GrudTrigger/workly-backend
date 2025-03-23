import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: RegisterUserDto) {
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
    const payload = {
      id: newUser.id,
      role: newUser.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user_data: { ...newUser, password: null },
    };
  }

  async signIn(dto: LoginUserDto) {
    const user = await this.userService.findUserByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('Неверный email или пароль');
    }
    const verifyPassword = await verify(user.password, dto.password);
    if (!verifyPassword) {
      throw new BadRequestException('Неверный email или пароль');
    }
    const payload = {
      id: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user_data: { ...user, password: null },
    };
  }
}
