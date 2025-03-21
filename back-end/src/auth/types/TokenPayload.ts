import { User } from '@prisma/client';

export type TokenPayload = Pick<User, 'name'> & {
  sub: string;
  exp?: number;
  iat?: number;
};
