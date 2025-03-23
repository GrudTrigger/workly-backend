import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Google' })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '/gr/company/google_logo.svg' })
  @IsString()
  @IsNotEmpty()
  avatar_path: string;

  @ApiProperty({ example: 'Занимаемся разработкой' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Москва' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'IT' })
  @IsString()
  @IsNotEmpty()
  field_of_activity: string;
}
