import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { EducationDto } from './education.dto';
import { ExperienceDto } from './experience.dto';

export class CreateProfileDto {
  @ApiProperty({ example: 'Иванов', description: 'Фамилия', required: true })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: 'Иван', description: 'Имя', required: true })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Москва', description: 'Город', required: true })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    example: 'Backend разработчик',
    description: 'Должность',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({ example: '123@mail.ru', description: 'Email', required: true })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '89999999999',
    description: 'Номер телефона',
    required: true,
  })
  @IsPhoneNumber('RU')
  @IsNotEmpty()
  phone_nubmer: number;

  @ApiProperty({
    example: 'Какой-то очень длинный текст о себе',
    description: 'О себе',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  about_me: string;

  @ApiProperty({
    example: 'html|css|js',
    description: 'Скиллы',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  skills: string;

  @ApiProperty({
    type: [ExperienceDto],
    description: 'Массив опыта работы',
    required: false,
  })
  @IsArray()
  @Type(() => ExperienceDto)
  experiences?: ExperienceDto[];

  @ApiProperty({
    type: [EducationDto],
    description: 'Массив образования, должен быть хотя бы 1 элемент',
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => EducationDto)
  educations: EducationDto[];
}
