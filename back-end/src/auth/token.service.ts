import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { TokenPayload } from './types/TokenPayload';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateTokens(uuid: string, payload: TokenPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_TOKEN_SECRET'),
        expiresIn: this.configService.get('JWT_TOKEN_EXPIRATION'),
      }),
      this.jwtService.signAsync(
        { ...payload, uuid },
        {
          secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  setAuthCookies(response: Response, tokens: Tokens) {
    const { accessToken, refreshToken } = tokens;

    const cookieOptions = {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    };

    response.cookie('accessToken', accessToken, cookieOptions);
    response.cookie('refreshToken', refreshToken, cookieOptions);
  }

  async hashToken(token: string): Promise<string> {
    return await bcrypt.hash(token, 10);
  }
}
