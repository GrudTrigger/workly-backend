import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class GetAllVacancy {
  @ApiProperty({
    example: 'backend',
    description: 'Название должности',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(4)
  position?: string;

  @ApiProperty({
    example: 10000,
    description: 'Уровень дохода от (salary_from)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salary_from?: number;

  @ApiProperty({
    example: 'Google',
    description: 'Название компании',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  company?: string;

  @ApiProperty({
    example: 'Полная занятость',
    description: 'Тип занятости',
    required: false,
  })
  @IsOptional()
  @IsString()
  type_of_employment?: string;

  @ApiProperty({
    example: 10,
    description: 'Количество компаний на страницу',
    required: true,
  })
  @Transform(({ value }) => Number(value))
  readonly limit: number;

  @ApiProperty({
    example: 0,
    description: 'Смещение для пагинации',
    required: true,
  })
  @Transform(({ value }) => Number(value))
  readonly offset: number;
}
