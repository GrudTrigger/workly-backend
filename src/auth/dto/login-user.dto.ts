import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: '123@mail.ru' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '12345' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
