import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtRequestPayload } from 'src/custom.types';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserView } from 'src/users/dto/user-view.dto';

@Injectable()
export class PermissionService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.permission.findMany();
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
