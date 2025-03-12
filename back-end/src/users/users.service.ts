import { Injectable } from '@nestjs/common';
import { CreateUser } from 'src/auth/types/CreateUser';
import { PrismaService } from 'src/prisma.service';

export type User = any;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async create(user: CreateUser) {
    return await this.prisma.user.create({ data: { ...user } });
  }
}
