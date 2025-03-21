import { Module } from '@nestjs/common';
import { InvitationCodeController } from './invitation-code.controller';
import { InvitationCodeService } from './invitation-code.service';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [InvitationCodeController],
  providers: [InvitationCodeService, PrismaService],
})
export class InvitationCodeModule {}
