import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async register(dto: any) {
    // TODO: implementar registro (hash contraseña, crear user, devolver tokens)
    return { message: 'register endpoint - implement me' };
  }

  async login(dto: any) {
    // TODO: implementar login (verificar contraseña, devolver access + refresh)
    return { message: 'login endpoint - implement me' };
  }
}
