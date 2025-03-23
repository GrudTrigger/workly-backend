import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterUserDto } from '../auth/dto/register-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.db.user.findFirst({
      where: { email },
    });
  }

  async createUser(dto: RegisterUserDto) {
    return this.db.user.create({ data: dto });
  }
}
