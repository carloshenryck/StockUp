import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { GoogleUser } from '../types/GoogleUser';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID', ''),
      clientSecret: configService.get('GOOGLE_SECRET', ''),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(acessToken, refreshToken, profile: GoogleUser) {
    const user = await this.authService.validateGoogleUser({
      email: profile.emails[0].value,
      name: profile.displayName,
      password: '',
    });
    return user;
  }
}
