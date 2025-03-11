import { Injectable } from '@nestjs/common';
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
}
