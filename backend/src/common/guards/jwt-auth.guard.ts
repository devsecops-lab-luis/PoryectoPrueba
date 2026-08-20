import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthUser } from '../../auth/auth.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: { authorization?: string }; user?: AuthUser }>();
    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
    const secret = process.env.JWT_ACCESS_SECRET;
    if (scheme !== 'Bearer' || !token || !secret) {
      throw new UnauthorizedException('Authentication required');
    }

    try {
      request.user = jwt.verify(token, secret) as AuthUser;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
