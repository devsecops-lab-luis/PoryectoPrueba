import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthUser } from './auth.types';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    try {
      const password = await bcrypt.hash(dto.password, 12);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email.toLowerCase(),
          password,
          name: dto.name.trim(),
          role: { connectOrCreate: { where: { name: 'USER' }, create: { name: 'USER' } } },
        },
        include: { role: true },
      });

      return this.issueTokens({ sub: user.id, email: user.email, role: user.role.name });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already registered');
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { role: true },
    });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokens({ sub: user.id, email: user.email, role: user.role.name });
  }

  private issueTokens(user: AuthUser) {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!accessSecret || !refreshSecret) {
      throw new InternalServerErrorException('JWT secrets are not configured');
    }

    return {
      accessToken: jwt.sign(user, accessSecret, { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' }),
      refreshToken: jwt.sign(user, refreshSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' }),
      user,
    };
  }
}
