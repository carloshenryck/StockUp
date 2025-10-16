import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { TokenService } from '../token.service';
import { TokenPayload } from '../types/TokenPayload';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private tokenService: TokenService) {
    super();
  }

  handleRequest<TUser = TokenPayload>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): TUser {
    // This method is called after the strategy's validate() method completes.
    if (user) {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();

      if (request.newTokens) {
        this.tokenService.setAuthCookies(response, request.newTokens);
      }
    }

    // Call the original handleRequest to preserve the default Passport behavior
    return super.handleRequest(err, user, info, context);
  }
}
