import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from '../constants';
import { User } from '@prisma/client';
import { PERMISSIONS_KEY } from 'decorators/permissions.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionGuard implements CanActivate {
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
      const rolesList = roles.map((role) => {
        return role.role.name;
      });

      const permissions = await this.prismaService.permission.findMany({
        where: {
          RolePermission: {
            some: {
              role: {
                name: {
                  in: rolesList,
                },
              },
            },
          },
        },
        include: {
          RolePermission: {
            where: {
              role: {
                name: {
                  in: rolesList,
                },
              },
            },
          },
        },
      });

      const permissionsList = permissions.map((permission) => {
        return permission.name;
      });

      // console.log(permissionsList);

      const requiredPermissions = this.reflector.get<string[]>(
        PERMISSIONS_KEY,
        context.getHandler(),
      );

      // console.log(requiredPermissions);

      // If no roles are defined in metadata, skip role check
      if (!requiredPermissions || requiredPermissions.length === 0) {
        // throw new InternalServerErrorException('Esto es inaccesible');
        return true;
      }

      const hasRequiredPermission = permissionsList?.some((permission) =>
        requiredPermissions.includes(permission),
      );

      if (!hasRequiredPermission) {
        throw new UnauthorizedException(
          'No tienes acceso a esto, no tienes los permisos suficientes',
        );
      }

      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'La sesión ya expiró, inicie sesión nuevamente',
        );
      }
      //TODO: Continua la implementacion rol - permiso (RBAC)
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Error de autorización',
      );
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
