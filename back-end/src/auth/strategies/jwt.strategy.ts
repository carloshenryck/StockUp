import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { TokenService } from '../token.service';
import { TokenPayload } from '../types/TokenPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookies = request.cookies as { [key: string]: string };
          return cookies?.accessToken;
        },
      ]),
      passReqToCallback: true,
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_TOKEN_SECRET') as string,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const isAcessTokenExpired = payload.exp && Date.now() >= payload.exp * 1000;
    if (!isAcessTokenExpired) {
      return payload;
    }

    const refreshTokenPayload = await this.getRefreshTokenPayload(
      request.cookies['refreshToken'] as string | undefined,
    );
    const isRefreshTokenOnDb = await this.isRefreshTokenOnDb(
      refreshTokenPayload.uuid,
    );

    if (!isRefreshTokenOnDb) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const uuid = uuidv4();
    const tokens = await this.tokenService.generateTokens(uuid, {
      sub: refreshTokenPayload.sub,
    });
    const hashedRefreshToken = await this.tokenService.hashToken(
      tokens.refreshToken,
    );

    await this.prisma.$transaction([
      this.prisma.refreshToken.create({
        data: {
          id: uuid,
          userId: refreshTokenPayload.sub,
          token: hashedRefreshToken,
        },
      }),
      this.prisma.refreshToken.delete({
        where: { id: refreshTokenPayload.uuid },
      }),
    ]);

    request.newTokens = tokens;

    return payload;
  }

  async getRefreshTokenPayload(refreshToken: string | undefined) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token não encontrado');
    }

    try {
      const payload = this.jwtService.verify<TokenPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });

      return payload;
    } catch (err: unknown) {
      if (err instanceof TokenExpiredError) {
        const decoded = this.jwtService.decode<TokenPayload>(refreshToken);
        const isRefreshTokenOnDb = await this.isRefreshTokenOnDb(
          decoded?.uuid as string,
        );

        if (isRefreshTokenOnDb) {
          await this.prisma.refreshToken.delete({
            where: { id: decoded.uuid },
          });
        }
        throw new UnauthorizedException('Refresh token expirado');
      }
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  async isRefreshTokenOnDb(uuid: string | undefined) {
    if (!uuid) return false;
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { id: uuid },
    });

    return refreshToken ? true : false;
  }
}
