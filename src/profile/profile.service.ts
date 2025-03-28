import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly db: PrismaService) {}

  async create(idUser: number, dto: CreateProfileDto) {
    const existedProfile = await this.db.profile.findUnique({
      where: {
        userId: idUser,
      },
    });
    if (existedProfile) {
      throw new BadRequestException(
        'У данного пользователя профиль уже создан',
      );
    }
    await this.db.profile.create({
      data: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        avatar_path: dto.avatar_path,
        city: dto.city,
        position: dto.position,
        email: dto.email,
        phone_number: dto.phone_number,
        about_me: dto.about_me,
        skills: dto.skills,
        experiences: dto.experiences
          ? {
              create: dto.experiences.map((exp) => ({
                start: exp.start,
                ending: exp.ending,
                end: exp.end ? exp.end : undefined,
                company: exp.company,
                position: exp.position,
                responsibilities: exp.responsibilities,
              })),
            }
          : undefined,
        educations: {
          create: dto.educations.map((ed) => ({
            name: ed.name,
            faculty: ed.faculty,
            end_year: ed.end_year,
            specialization: ed.specialization,
          })),
        },
      },
      include: {
        experiences: true,
        educations: true,
      },
    });
    return { message: 'success' };
  }
}
