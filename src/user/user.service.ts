import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.db.user.findFirst({
      where: { email },
    });
  }

  async findUserById(id: number) {
    return this.db.user.findUnique({
      where: { id },
    });
  }

  async createUser(dto: RegisterUserDto) {
    return this.db.user.create({ data: dto });
  }

  async updateUser(id: number, refreshToken: string) {
    try {
      await this.db.user.update({
        where: { id: id },
        data: {
          refresh_token: await hash(refreshToken),
        },
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
