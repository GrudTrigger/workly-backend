import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateVacancyDto {
  @ApiProperty({
    example: 'Middle Backend develop',
    description: 'Название вакансии',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({
    example: 'Какое-то длинное описание вакансии',
    description: 'Описание вакансии',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 10000, description: 'Зарплата от', required: true })
  @IsNumber()
  @Min(0)
  salary_from: number;

  @ApiProperty({ example: 20000, description: 'Зарплата до', required: true })
  @IsNumber()
  @Min(0)
  salary_to: number;

  @ApiProperty({
    example: 'от 1 года',
    description: 'Опыт работы',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  work_experience: string;

  @ApiProperty({
    example: 'полная',
    description: 'Тип занятости',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  type_of_employment: string;

  @ApiProperty({
    example: 'офис',
    description: 'Формат работы',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  format_work: string;

  @ApiProperty({
    example: 'html|css|js',
    description: 'Навыки',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  skills: string;

  @ApiProperty({
    example: 1,
    description: 'Id компании для которой создается вакансия',
    required: true,
  })
  @IsNumber()
  @Min(1)
  id_company: number;
}
