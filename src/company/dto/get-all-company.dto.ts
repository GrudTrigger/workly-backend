import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class GetAllCompanyDto {
  @ApiProperty({
    example: 'google',
    description: 'Название компании',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  readonly name?: string;

  @ApiProperty({
    example: 'Москва',
    description: 'Название города',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  readonly city?: string;

  @ApiProperty({
    example: 'IT',
    description: 'Сфера деятельности',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  readonly field_of_activity?: string;

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
