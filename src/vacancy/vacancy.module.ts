import { Module } from '@nestjs/common';
import { CompanyModule } from 'src/company/company.module';
import { PrismaService } from 'src/prisma.service';
import { VacancyController } from './vacancy.controller';
import { VacancyService } from './vacancy.service';

@Module({
  imports: [CompanyModule],
  controllers: [VacancyController],
  providers: [VacancyService, PrismaService],
})
export class VacancyModule {}
