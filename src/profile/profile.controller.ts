import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { RequestWithUser } from 'src/types/user-types';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service';

@ApiTags('Профили пользователей')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Создание профиля' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req: RequestWithUser, @Body() dto: CreateProfileDto) {
    console.log(req.user);
    return await this.profileService.create(req.user.id, dto);
  }
}
