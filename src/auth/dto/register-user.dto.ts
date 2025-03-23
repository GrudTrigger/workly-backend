import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: '123@mail.ru' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '12345' })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;

  @ApiProperty({ example: 'user' })
  @IsNotEmpty()
  @IsString()
  role: string = 'user';
}
