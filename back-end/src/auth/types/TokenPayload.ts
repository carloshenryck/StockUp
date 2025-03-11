import { PublicUser } from './PublicUser';

export type TokenPayload = Omit<PublicUser, 'id'> & {
  sub: string;
  exp?: number;
  iat?: number;
};
