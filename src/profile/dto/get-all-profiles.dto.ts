import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetAllProfilesDto {
  @ApiProperty({
    example: 'Петров Петр',
    description: 'Фильтарция по ФИО',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    example: 'Backend разработчик',
    description: 'Фильтрация по должности',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  position?: string;

  @ApiProperty({
    example: 'html css',
    description: 'Поиск по навыкам',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  skills?: string;

  @ApiProperty({
    example: 'Москва',
    description: 'Фильтрация по городу',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @ApiProperty({
    example: 10,
    description: 'Количество компаний на страницу',
    required: true,
  })
  @Transform(({ value }) => Number(value))
  limit: number;

  @ApiProperty({
    example: 0,
    description: 'Смещение для пагинации',
    required: true,
  })
  @Transform(({ value }) => Number(value))
  offset: number;
}
