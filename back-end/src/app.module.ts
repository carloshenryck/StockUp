import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { InvitationCodeModule } from './invitation-code/invitation-code.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    InvitationCodeModule,
    CompanyModule,
  ],
})
export class AppModule {}
