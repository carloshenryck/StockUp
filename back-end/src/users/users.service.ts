import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      email: 'ememik@riwumina.fi',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      email: 'hem@jucfavup.bd',
    },
  ];

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
