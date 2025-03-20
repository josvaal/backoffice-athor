import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtRequestPayload } from 'src/custom.types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private prismaService: PrismaService) {}

  async findAll(res: Response, page: number = 1, limit: number = 10) {
    page = Math.max(page, 1);
    limit = Math.max(limit, 1);

    const skip = (page - 1) * limit; // Cálculo correcto de skip
    const take = limit;

    const [permissions, total] = await Promise.all([
      this.prismaService.permission.findMany({
        skip: skip,
        take: take,
        include: {
          RolePermission: {
            include: {
              role: true,
            },
          },
        },
      }),
      this.prismaService.permission.count(),
    ]);

    res.set({
      'Access-Control-Expose-Headers': 'x-total-count',
      'x-total-count': total,
      'x-current-page': page,
      'x-per-page': limit,
      'x-total-pages': Math.ceil(total / limit),
    });

    return res.json(permissions);
  }

  async findById(id: number | string) {
    const permissionId = Number(id);

    if (isNaN(permissionId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    return await this.prismaService.permission.findUnique({
      where: {
        id: permissionId,
      },
      include: {
        RolePermission: {
          select: {
            role: true,
          },
        },
      },
    });
  }

  async findPermissionsByMe(request: JwtRequestPayload) {
    const userJwt = request.user.user;

    if (!userJwt) {
      throw new BadRequestException('Nos eproporcionó un token adecuado');
    }

    if (!userJwt.id) {
      throw new BadRequestException('El token proporcionado no es válido');
    }

    const userPermissions = await this.prismaService.user.findUnique({
      where: {
        id: userJwt.id,
      },
      select: {
        UserRole: {
          select: {
            role: {
              select: {
                RolePermission: {
                  select: {
                    permission: {
                      select: {
                        id: true,
                        name: true,
                        groupName: true,
                        description: true,
                        path: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const permissions = userPermissions?.UserRole?.flatMap((userRole) =>
      userRole.role.RolePermission.map(
        (rolePermission) => rolePermission.permission,
      ),
    );

    return permissions;
  }

  async findPermissionsByUserId(id: number | string) {
    const userId = Number(id);

    if (isNaN(userId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    const userPermissions = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        UserRole: {
          select: {
            role: {
              select: {
                RolePermission: {
                  select: {
                    permission: {
                      select: {
                        id: true,
                        name: true,
                        groupName: true,
                        description: true,
                        path: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const permissions = userPermissions?.UserRole?.flatMap((userRole) =>
      userRole.role.RolePermission.map(
        (rolePermission) => rolePermission.permission,
      ),
    );

    return permissions;
  }

  async assignRole(idRole: number | string, idPermission: number | string) {
    const rId = Number(idRole);

    if (isNaN(rId)) {
      throw new BadRequestException(`El ID de este rol no es válido`);
    }

    const pId = Number(idPermission);

    if (isNaN(pId)) {
      throw new BadRequestException('El ID de este permiso no es válido');
    }

    return await this.prismaService.rolePermission.create({
      data: {
        roleId: rId,
        permissionId: pId,
      },
    });
  }

  async deassignRole(idRole: number | string, idPermission: number | string) {
    const rId = Number(idRole);

    if (isNaN(rId)) {
      throw new BadRequestException(`El ID de este rol no es válido`);
    }

    const pId = Number(idPermission);

    if (isNaN(pId)) {
      throw new BadRequestException('El ID de este permiso no es válido');
    }

    const rolePermission = await this.prismaService.rolePermission.findFirst({
      where: {
        roleId: rId,
        permissionId: pId,
      },
    });

    if (!rolePermission) {
      throw new NotFoundException('Esta relacion rol-permiso no existe');
    }

    return await this.prismaService.rolePermission.delete({
      where: {
        id: rolePermission.id,
      },
    });
  }
}
