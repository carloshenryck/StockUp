import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: LoginDto) {
    const tokens = await this.getTokens('0', user.email);
    return tokens;
  }

  async signup(dto: SignupDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Usuário já cadastrado');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });

    const tokens = await this.getTokens(user.id, user.email);
    return tokens;
  }

  async getTokens(userId: string, email: string) {
    const jwtPayload = {
      sub: userId,
      email,
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
}
