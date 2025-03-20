import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from '../constants';
import { User } from '@prisma/client';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'decorators/roles.decorator';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const user = payload['user'] as User;
      const userDb = await this.usersService.findById(user.id);

      const roles = userDb?.UserRole;

      const requiredRoles = this.reflector.get<string[]>(
        ROLES_KEY,
        context.getHandler(),
      );

      // If no roles are defined in metadata, skip role check
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      const hasRequiredRole = roles?.some((role) =>
        requiredRoles.includes(role.role.name),
      );

      if (!hasRequiredRole) {
        throw new UnauthorizedException(
          'No tienes acceso a este recurso, consulta con un administrador o de rol más alto.',
        );
      }
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'La sesión ya expiró, inicie sesión nuevamente',
        );
      }
      throw new UnauthorizedException(
        'No tienes acceso a esto, consulta a un administrador o de rol más alto',
      );
    }
    // return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
