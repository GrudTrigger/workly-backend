import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { RequestWithUser } from 'src/types/user-types';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service';
import { GetAllProfilesDto } from './dto/get-all-profiles.dto';

@ApiTags('Профили пользователей')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Создание профиля' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req: RequestWithUser, @Body() dto: CreateProfileDto) {
    return await this.profileService.create(req.user.id, dto);
  }
  @ApiOperation({ summary: 'Получение моего профиля(резюме)' })
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getProfile(@Request() req: RequestWithUser) {
    return await this.profileService.getMyProfile(req.user.id);
  }

  @ApiOperation({ summary: 'Получение всех профилей (резюме)' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('all')
  async getAllProfiles(@Query() query: GetAllProfilesDto) {
    return await this.profileService.getAllProfiles(query);
  }

  @ApiOperation({ summary: 'Получение профиля по id' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get(':id')
  async getProfileById(@Param('id') id: number) {
    return await this.profileService.getProfileById(id);
  }

  @ApiOperation({ summary: 'Редактирование профиля' })
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateProfile(
    @Param('id') id: number,
    @Request() req: RequestWithUser,
    @Body() dto: Partial<CreateProfileDto>,
  ) {
    return await this.profileService.update(id, req.user.id, dto);
  }
}
