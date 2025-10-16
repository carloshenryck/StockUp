import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { User as IUser } from '@prisma/client';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { User } from './decorators/user.decorator';
import { SignupDto } from './dto/signup.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user.id, response);
  }

  @Post('signup')
  async signup(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signup(dto, response);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user.id, response);
    response.redirect(`http://localhost:3000`);
  }
}
