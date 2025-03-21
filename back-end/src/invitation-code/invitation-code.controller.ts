import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { InvitationCodeService } from './invitation-code.service';
import { User } from 'src/auth/decorators/user.decorator';
import { TokenPayload } from 'src/auth/types/TokenPayload';

@Controller('invitation-code')
export class InvitationCodeController {
  constructor(private invitationCodeService: InvitationCodeService) {}

  @UseGuards(JwtAuthGuard)
  @Get('create')
  async create(@User() dto: TokenPayload) {
    return this.invitationCodeService.create(dto.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('join-company')
  async joinCompany(@User() dto: TokenPayload, @Body() body: { code: string }) {
    return this.invitationCodeService.joinCompany(dto.sub, body.code);
  }
}
