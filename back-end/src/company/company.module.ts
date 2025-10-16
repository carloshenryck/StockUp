import { Module } from '@nestjs/common';
import { InvitationCodeModule } from 'src/invitation-code/invitation-code.module';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({
  imports: [UsersModule, InvitationCodeModule],
  controllers: [CompanyController],
  providers: [CompanyService, PrismaService],
})
export class CompanyModule {}
