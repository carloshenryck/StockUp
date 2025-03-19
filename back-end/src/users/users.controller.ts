import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayload } from 'src/auth/types/TokenPayload';

@Controller()
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() user: TokenPayload) {
    return user;
  }
}
