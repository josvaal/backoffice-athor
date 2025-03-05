import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRoleService } from 'src/user-role/user-role.service';
import { jwtConstants } from '../constants';
import { User } from '@prisma/client';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'decorators/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private userRoleService: UserRoleService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      const user = payload['user'] as User;
      const roles = await this.userRoleService.findRolesByUserId(user.id);

      const requiredRoles = this.reflector.get<string[]>(
        ROLES_KEY,
        context.getHandler(),
      );

      // If no roles are defined in metadata, skip role check
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      const hasRequiredRole = roles.some((role) =>
        requiredRoles.includes(role.name),
      );

      if (!hasRequiredRole) {
        throw new UnauthorizedException(
          'No tienes acceso a este recurso, consulta con un administrador o de rol más alto.',
        );
      }
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
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
