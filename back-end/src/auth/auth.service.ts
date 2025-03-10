import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
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
