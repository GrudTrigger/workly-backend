import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { RequestWithUser } from '../types/user-types';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from '@prisma/client';
import { GetAllCompanyDto } from './dto/get-all-company.dto';
import { UploadCompanyDto } from './dto/upload-company.dto';

@ApiTags('Компании')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создание компании' })
  @Post()
  async create(
    @Request() req: RequestWithUser,
    @Body() dto: CreateCompanyDto,
  ): Promise<Company> {
    return await this.companyService.create(req.user, dto);
  }

  @ApiOperation({ summary: 'Получение всех компаний' })
  @Get()
  async findAll(@Query() query: GetAllCompanyDto) {
    return this.companyService.findAll(query);
  }

  @ApiOperation({ summary: 'Получение компании по id' })
  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.companyService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Изменение компании по id (изменять компании может только user который ее создал)',
  })
  @Patch(':id')
  async update(
    @Request() req: RequestWithUser,
    @Param('id') id: number,
    @Body() dto: UploadCompanyDto,
  ) {
    await this.companyService.upload(req.user, id, dto);
  }
}
