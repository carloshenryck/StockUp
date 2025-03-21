import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InvitationCode } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class InvitationCodeService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  isInvitationCodeValid(invitationCode: InvitationCode | null): boolean {
    if (!invitationCode || invitationCode.expiresAt < new Date()) {
      return false;
    }
    return true;
  }

  async create(userId: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user || !user.companyId) {
      throw new NotFoundException('Usuário ou organização não encontrada');
    }

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Apenas administradores podem criar códigos de convite',
      );
    }

    const invitationCode = await this.prisma.invitationCode.findUnique({
      where: { companyId: user.companyId },
    });

    const isCodeValid = this.isInvitationCodeValid(invitationCode);
    if (invitationCode && isCodeValid) {
      return { code: invitationCode.code };
    }

    if (invitationCode && !isCodeValid) {
      await this.prisma.invitationCode.delete({
        where: { id: invitationCode.id },
      });
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const fiveMinutesInMs = 5 * 60 * 1000;
    const newInvitationCode = await this.prisma.invitationCode.create({
      data: {
        code,
        companyId: user.companyId,
        expiresAt: new Date(Date.now() + fiveMinutesInMs),
      },
    });

    return { code: newInvitationCode.code };
  }

  async joinCompany(userId: string, code: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.companyId) {
      throw new ForbiddenException('Usuário já pertence a uma organização');
    }

    const invitationCode = await this.prisma.invitationCode.findUnique({
      where: { code },
    });

    if (!this.isInvitationCodeValid(invitationCode)) {
      throw new ForbiddenException('Código de convite inválido');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { companyId: invitationCode?.companyId },
    });

    return {};
  }
}
