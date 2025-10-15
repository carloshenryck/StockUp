import { Injectable } from '@nestjs/common';
import { CreateUser } from 'src/auth/types/CreateUser';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
    return user;
  }

  async findOneById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async create(user: CreateUser) {
    return await this.prisma.user.create({ data: { ...user } });
  }
}
