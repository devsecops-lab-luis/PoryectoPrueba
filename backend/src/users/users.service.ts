import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  async findAll() {
    return { message: 'users findAll - implement me' };
  }

  async findOne(id: string) {
    return { message: `users findOne ${id} - implement me` };
  }
}
