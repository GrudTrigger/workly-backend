import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { TokenUser } from '../types/user-types';
import { GetAllCompanyDto } from './dto/get-all-company.dto';
import { UploadCompanyDto } from './dto/upload-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly db: PrismaService) {}

  async create(user: TokenUser, dto: CreateCompanyDto) {
    const existedCompanyName = await this.db.company.findUnique({
      where: {
        name: dto.name,
      },
    });
    if (existedCompanyName) {
      throw new HttpException(
        `Компания с названием ${dto.name} уже зарегистрированна`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.db.company.create({
      data: {
        ...dto,
        userId: user.id,
      },
    });
  }

  async findAll(query: GetAllCompanyDto) {
    const { name, city, field_of_activity, limit, offset } = query;
    const filterParams = {};
    if (name) {
      filterParams['name'] = { contains: name, mode: 'insensitive' };
    }
    if (city) {
      filterParams['city'] = { contains: city, mode: 'insensitive' };
    }
    if (field_of_activity) {
      filterParams['field_of_activity'] = {
        contains: field_of_activity,
        mode: 'insensitive',
      };
    }
    return this.db.company.findMany({
      where: filterParams,
      take: limit ? limit : 10,
      skip: offset ? offset : 0,
      include: {
        company_founder: true,
      },
    });
  }

  async findById(id: number) {
    return this.db.company.findUnique({
      where: { id },
      include: {
        company_founder: true,
      },
    });
  }

  async upload(user: TokenUser, id: number, dto: UploadCompanyDto) {
    const company = await this.db.company.findUnique({
      where: {
        id,
      },
      include: {
        company_founder: true,
      },
    });
    if (!company) {
      throw new BadRequestException('Компания не найдена');
    }
    if (company.company_founder.id !== user.id) {
      throw new BadRequestException(
        'Вносить изменения может только владелец компании',
      );
    }
    return this.db.company.update({
      where: {
        id: company.id,
      },
      data: {
        ...dto,
      },
    });
  }
}
