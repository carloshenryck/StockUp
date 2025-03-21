import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class InvitationCodeService {
  constructor(private prisma: PrismaService) {}

  async create() {}
}
