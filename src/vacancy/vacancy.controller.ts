import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { RequestWithUser } from 'src/types/user-types';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { GetAllVacancy } from './dto/get-all-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { VacancyService } from './vacancy.service';
@ApiTags('Вакансии')
@Controller('vacancy')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создание вакансии' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() dto: CreateVacancyDto, @Request() req: RequestWithUser) {
    return await this.vacancyService.create(dto, req.user.id);
  }

  @ApiOperation({ summary: 'Получение всех вакансий' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() query: GetAllVacancy) {
    return await this.vacancyService.findAll(query);
  }

  @ApiOperation({ summary: 'Получение вакансии по id' })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.vacancyService.findById(id);
  }

  @ApiOperation({
    summary: 'Редактирование вакансии (доступно 15 минут после публикации)',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateVacancyDto,
    @Request() req: RequestWithUser,
  ) {
    return await this.vacancyService.update(id, dto, req.user.id);
  }

  @ApiOperation({ summary: 'Удаление вакансии' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async delete(@Param('id') id: number, @Request() req: RequestWithUser) {
    return await this.vacancyService.delete(id, req.user.id);
  }
}
