import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcryptjs';
import { PublicUser } from './types/PublicUser';
import { User } from '@prisma/client';

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
    const user = await this.usersService.findOne(email);
    if (!user) return null;

    const passwordMatch = await bcrypt.compare(plainPassword, user.password);
    if (!passwordMatch) return null;

    return user;
  }

  async login(dto: User) {
    const { password, refresh_token, ...publicUser } = dto;
    const tokens = await this.getTokens(publicUser);
    await this.updateRefreshToken(dto.id, tokens.refresh_token);
    return tokens;
  }

  async signup(dto: SignupDto) {
    const existingUser = await this.usersService.findOne(dto.email);
    if (existingUser) {
      throw new ConflictException('Usuário já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });

    return this.login(user);
  }

  async getTokens(user: PublicUser) {
    const { id, ...rest } = user;
    const jwtPayload = {
      sub: id,
      ...rest,
    };

    const [acess_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get('JWT_TOKEN_SECRET'),
        expiresIn: this.config.get('JWT_TOKEN_EXPIRATION'),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_TOKEN_EXPIRATION'),
      }),
    ]);

    return {
      acess_token,
      refresh_token,
    };
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refresh_token: hashedRefreshToken },
    });
  }
}
