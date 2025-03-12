import { Controller, Post, UseGuards, Body, Res, Get } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { User } from './decorators/user.decorator';
import { User as IUser } from '@prisma/client';
import { Response } from 'express';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }

  @Post('signup')
  async signup(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signup(dto, response);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refreshToken(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
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
    const token = await this.authService.login(user, response);
    response.redirect(`http://localhost:3000?token=${token.access_token}`);
  }
}
