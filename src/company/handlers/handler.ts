import { BadRequestException } from '@nestjs/common';
import { CompanyService } from '../company.service';

export const checkUserBelongsToCompany = async (
  id_user: number,
  id_company: number,
  companyService: CompanyService,
) => {
  const company = await companyService.findById(id_company);

  if (company?.company_founder.id && company.userId !== id_user) {
    throw new BadRequestException('Вы не являетесь руководителем компании');
  }
};
