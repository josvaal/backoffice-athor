import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async findPermissionsByRoleIds(ids: (number | string)[]) {
    const roleIds = ids.map((id) => Number(id));

    if (roleIds.some((roleId) => isNaN(roleId))) {
      throw new BadRequestException(
        `Uno o más IDs proporcionados no son válidos`,
      );
    }

    return await this.prismaService.rolePermission.findMany({
      where: {
        roleId: { in: roleIds },
      },
      include: {
        permission: true,
      },
    });
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
