import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class EducationDto {
  @ApiProperty({
    example: 'МГУ',
    description: 'Название учебного заведения',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Прикладная информатика',
    description: 'Название факультета',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  faculty: string;

  @ApiProperty({
    example: 2014,
    description: 'Год окончания',
    required: true,
  })
  @IsNumber()
  @Min(1950)
  end_year: number;

  @ApiProperty({
    example: 'Программист',
    description: 'Специализация',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  specialization: string;
}
