import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { checkUserBelongsToCompany } from 'src/company/handlers/handler';
import { PrismaService } from 'src/prisma.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { GetAllVacancy } from './dto/get-all-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { MINUTE } from './handlers/handler';

@Injectable()
export class VacancyService {
  constructor(
    private readonly db: PrismaService,
    private readonly companyService: CompanyService,
  ) {}

  async create(dto: CreateVacancyDto, idUser: number) {
    const company = await this.companyService.findById(dto.id_company);
    if (!company) {
      throw new NotFoundException('Компания с таким id не существует');
    }
    await checkUserBelongsToCompany(idUser, company.id, this.companyService);

    return this.db.vacancy.create({
      data: {
        position: dto.position,
        description: dto.description,
        salary: {
          create: {
            salary_from: dto.salary_from,
            salary_to: dto.salary_to,
          },
        },
        work_experience: dto.work_experience,
        type_of_employment: dto.type_of_employment,
        format_work: dto.format_work,
        skills: dto.skills,
        companyId: dto.id_company,
      },
      include: {
        salary: true,
      },
    });
  }

  async findAll(query: GetAllVacancy) {
    const {
      position,
      salary_from,
      company,
      type_of_employment,
      limit,
      offset,
    } = query;
    const filterParams = {};
    const filterParamsCompany = {};
    if (position) {
      filterParams['position'] = { contains: position, mode: 'insensitive' };
    }
    if (salary_from) {
      filterParams['salary_from'] = { gt: salary_from };
    }
    if (company) {
      filterParamsCompany['name'] = {
        contains: company,
        mode: 'insensitive',
      };
    }
    if (type_of_employment) {
      filterParams['type_of_employment'] = {
        contains: company,
        mode: 'insensitive',
      };
    }
    return this.db.vacancy.findMany({
      where: {
        ...filterParams,
        company: {
          is: {
            ...filterParamsCompany,
          },
        },
      },
      take: limit ? limit : 10,
      skip: offset ? offset : 0,
      include: {
        salary: true,
        company: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    try {
      return this.db.vacancy.findUnique({
        where: {
          id,
        },
        include: {
          company: {
            select: {
              name: true,
            },
          },
        },
      });
    } catch (error) {
      throw new BadGatewayException(
        `Ошибка при получении вакансии по id - ${error}`,
      );
    }
  }

  async update(id: number, dto: UpdateVacancyDto, userId: number) {
    const vacancy = await this.findById(id);
    if (!vacancy?.companyId) {
      throw new NotFoundException(`Вакансия с id - ${id} не найдена`);
    }

    const company = await this.companyService.findById(vacancy.companyId);
    if (!company) {
      throw new NotFoundException('Ошибка при поиске компании');
    }

    if (company.company_founder.id !== userId) {
      throw new BadRequestException(
        'У вас нет прав на изменение данной вакансии',
      );
    }

    const createdAt = new Date(String(vacancy.createdAt));
    const nowDate = new Date().getTime();
    if (nowDate - createdAt.getTime() > Number(MINUTE.FIFTEEN)) {
      throw new BadRequestException(
        'Вакансию можно изменить только в первые 15 минут после создания',
      );
    }
    try {
      return this.db.vacancy.update({
        where: {
          id,
        },
        data: {
          ...dto,
        },
      });
    } catch (error) {
      throw new BadRequestException(`Ошибка при обновлении вакансии ${error}`);
    }
  }

  async delete(id: number, userId: number) {
    await checkUserBelongsToCompany(userId, id, this.companyService);
    try {
      return this.db.vacancy.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new BadRequestException(`Ошибка при удалении вакансии ${error}`);
    }
  }
}
