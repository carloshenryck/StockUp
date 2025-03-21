import { Module } from '@nestjs/common';
import { InvitationCodeController } from './invitation-code.controller';
import { InvitationCodeService } from './invitation-code.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [InvitationCodeController],
  providers: [InvitationCodeService, PrismaService],
})
export class InvitationCodeModule {}
