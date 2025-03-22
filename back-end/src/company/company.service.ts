import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InvitationCodeService } from 'src/invitation-code/invitation-code.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CompanyService {
  constructor(
    private invitationCodeService: InvitationCodeService,
    private usersService: UsersService,
    private prismaService: PrismaService,
  ) {}

  async create(userId: string, companyName: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user || user.companyId) {
      throw new ForbiddenException(
        'Usuário não encontrado ou já possui uma empresa',
      );
    }

    await this.prismaService.$transaction(async (prisma) => {
      await prisma.company.create({
        data: {
          name: companyName,
          users: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' },
      });
    });

    return {};
  }

  async join(userId: string, code: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.companyId) {
      throw new ForbiddenException('Usuário já pertence a uma organização');
    }

    const invitationCode = await this.invitationCodeService.findOneByCode(code);

    if (!this.invitationCodeService.isInvitationCodeValid(invitationCode)) {
      throw new ForbiddenException('Código de convite inválido');
    }

    await this.prismaService.user.update({
      where: { id: userId },
      data: { companyId: invitationCode?.companyId, role: 'USER' },
    });

    return {};
  }
}
