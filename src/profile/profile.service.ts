import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { GetAllProfilesDto } from './dto/get-all-profiles.dto';
import { Paths } from 'tsconfig-paths/lib/mapping-entry';

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
    try {
      const { experiences, educations, ...profileData } = dto;
      await this.db.profile.create({
        data: {
          ...profileData,
          experiences: experiences?.length
            ? { create: experiences }
            : undefined,
          educations: educations.length ? { create: educations } : undefined,
        },
        include: {
          experiences: true,
          educations: true,
        },
      });
      return { message: 'success' };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getMyProfile(idUser: number) {
    const existedProfile = await this.db.profile.findUnique({
      where: {
        userId: idUser,
      },
    });
    if (!existedProfile) {
      throw new BadRequestException('Профиль не найден !');
    }
    return existedProfile;
  }

  async getAllProfiles(query: GetAllProfilesDto) {
    const { name, position, skills, city, limit, offset } = query;
    const whereCondition = {};
    if (name) {
      whereCondition['name'] = { contains: name, mode: 'insensitive' };
    }
    if (position) {
      whereCondition['position'] = { contains: position, mode: 'insensitive' };
    }
    if (skills) {
      whereCondition['skills'] = { contains: skills, mode: 'insensitive' };
    }
    if (city) {
      whereCondition['city'] = { contains: city, mode: 'insensitive' };
    }
    return this.db.profile.findMany({
      where: whereCondition,
      take: limit,
      skip: offset,
    });
  }

  async getProfileById(id: number) {
    return this.db.profile.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id_profile: number,
    id_user: number,
    dto: Partial<CreateProfileDto>,
  ) {
    const profile = await this.db.profile.findUnique({
      where: {
        id: id_profile,
      },
      select: { userId: true },
    });
    if (!profile) {
      throw new BadRequestException(`Профиль с ${id_profile} не найден`);
    }
    if (profile.userId !== id_user) {
      throw new BadRequestException('Вы не можете редактировать чужой профиль');
    }

    const { experiences, educations, ...data } = dto;

    await this.db.profile.update({});
  }
}
