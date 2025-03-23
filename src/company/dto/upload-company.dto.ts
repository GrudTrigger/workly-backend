import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadCompanyDto {
  @ApiProperty({ example: 'Yandex' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiProperty({ example: '/gr/company/123.svg' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  avatar_path?: string;

  @ApiProperty({ example: 'Чем-то занимаемся' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Спб' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'Продажи' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  field_of_activity?: string;
}
