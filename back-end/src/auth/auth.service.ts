import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { SignupDto } from './dto/signup.dto';
import { CreateUser } from './types/CreateUser';
import { TokenPayload } from './types/TokenPayload';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async validateUser(
    email: string,
    plainPassword: string,
  ): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) return null;

    const passwordMatch = await bcrypt.compare(plainPassword, user.password);
    if (!passwordMatch) return null;

    return user;
  }

  async login(userId: string, response: Response) {
    const uuid = uuidv4();
    const tokens = await this.getTokens(uuid, { sub: userId });
    await this.saveRefreshToken(uuid, userId, tokens.refreshToken);

    response.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      expires: this.tokenExpirationInMs(tokens.accessToken),
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      expires: this.tokenExpirationInMs(tokens.refreshToken),
    });

    return {
      message: 'Login realizado com sucesso',
    };
  }

  async signup(dto: SignupDto, response: Response) {
    const existingUser = await this.usersService.findOneByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Usuário já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });

    return this.login(user.id, response);
  }

  async getTokens(uuid: string, payload: TokenPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_TOKEN_SECRET'),
        expiresIn: this.config.get('JWT_TOKEN_EXPIRATION'),
      }),
      this.jwtService.signAsync(
        { ...payload, uuid },
        {
          secret: this.config.get('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: this.config.get('JWT_REFRESH_TOKEN_EXPIRATION'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveRefreshToken(uuid: string, userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.refreshToken.create({
      data: {
        id: uuid,
        userId,
        token: hashedRefreshToken,
      },
    });
  }

  async refreshTokens(userId: string, response: Response, request: Request) {
    const refreshTokenFromCookies = request.cookies['refreshToken'] as string;
    const payload = this.jwtService.decode<TokenPayload>(
      refreshTokenFromCookies,
    );

    const refreshTokenFromUser = await this.prisma.refreshToken.findUnique({
      where: { id: payload.uuid },
    });
    if (!refreshTokenFromUser) {
      throw new UnauthorizedException('Token inválido');
    }

    await this.prisma.refreshToken.delete({
      where: { id: payload.uuid },
    });

    return this.login(userId, response);
  }

  async validateGoogleUser(googleUser: CreateUser) {
    const user = await this.usersService.findOneByEmail(googleUser.email);
    if (user) return user;
    return await this.usersService.create(googleUser);
  }

  tokenExpirationInMs(token: string) {
    const decoded = this.jwtService.decode<TokenPayload>(token);
    if (!decoded?.exp) {
      throw new Error('Invalid token: missing expiration time');
    }

    return new Date(decoded.exp * 1000);
  }
}
