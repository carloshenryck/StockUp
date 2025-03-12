import { User } from '@prisma/client';

export type CreateUser = Pick<User, 'email' | 'name' | 'password'>;
