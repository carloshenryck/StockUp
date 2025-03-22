import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
