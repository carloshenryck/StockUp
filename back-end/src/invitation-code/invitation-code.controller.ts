import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { InvitationCodeService } from './invitation-code.service';

@Controller('invitation-code')
export class InvitationCodeController {
  constructor(private invitationCodeService: InvitationCodeService) {}

  @UseGuards(JwtAuthGuard)
  @Get('create')
  async create() {
    return this.invitationCodeService.create();
  }
}
