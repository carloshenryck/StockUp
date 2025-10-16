import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { SignupDto } from './dto/signup.dto';
import { TokenService } from './token.service';
import { CreateUser } from './types/CreateUser';
import { TokenPayload } from './types/TokenPayload';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
    private tokenService: TokenService,
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

    const tokens = await this.tokenService.generateTokens(uuid, {
      sub: userId,
    });

    await this.saveRefreshToken(uuid, userId, tokens.refreshToken);

    this.tokenService.setAuthCookies(response, tokens);

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

  async saveRefreshToken(uuid: string, userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.tokenService.hashToken(refreshToken);
    await this.prisma.refreshToken.create({
      data: {
        id: uuid,
        userId,
        token: hashedRefreshToken,
      },
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
