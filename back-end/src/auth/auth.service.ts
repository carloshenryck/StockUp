import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { Response } from 'express';
import { TokenPayload } from './types/TokenPayload';
import { CreateUser } from './types/CreateUser';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
    private prismaService: PrismaService,
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

  async login(dto: User, response: Response) {
    const { id, name } = dto;

    const tokens = await this.getTokens({ sub: id, name });
    await this.updateRefreshToken(dto.id, tokens.refreshToken);

    response.cookie('accessToken', tokens.acessToken, {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      expires: this.tokenExpirationInMs(tokens.acessToken),
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      expires: this.tokenExpirationInMs(tokens.refreshToken),
    });

    return {};
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

    return this.login(user, response);
  }

  async getTokens(payload: TokenPayload) {
    const [acessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_TOKEN_SECRET'),
        expiresIn: this.config.get('JWT_TOKEN_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_TOKEN_EXPIRATION'),
      }),
    ]);

    return {
      acessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
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
