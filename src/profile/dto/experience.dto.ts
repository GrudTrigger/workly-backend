import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ExperienceDto {
  @ApiProperty({
    example: '04/2015',
    description: 'Начало работы месяц/год',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  start: string;

  @ApiProperty({
    example: false,
    description: 'Работает ли по настоящее время',
    required: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  ending: boolean;

  @ApiProperty({
    example: '01/2024',
    description: 'Окончание работы',
    required: false,
  })
  @IsOptional()
  @IsString()
  end?: string;

  @ApiProperty({
    example: 'Google',
    description: 'Название компании',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({
    example: 'Backend developer',
    description: 'Название должности',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  position: string;
}
