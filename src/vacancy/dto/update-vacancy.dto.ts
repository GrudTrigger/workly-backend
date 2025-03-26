import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateVacancyDto {
  @ApiProperty({
    example: 'frontend рзработчик',
    description: 'Название должности',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  position?: string;

  @ApiProperty({
    example: 'Какое-то новое длинное описание вакансии',
    description: 'Описание вакансии',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({
    example: 'от 1 до 3 лет',
    description: 'Требуемый опыт работы',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  work_experience?: string;

  @ApiProperty({
    example: 'частичная',
    description: 'Тип занятости',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  type_of_employment?: string;

  @ApiProperty({
    example: 'удаленка',
    description: 'Формат работы',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  format_work?: string;

  @ApiProperty({
    example: 'ts|node.js|nest.js',
    description: 'Навыки',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  skills?: string;
}
