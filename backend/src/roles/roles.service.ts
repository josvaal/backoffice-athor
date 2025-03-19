import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Response } from 'express';

@Injectable()
export class RolesService {
  constructor(private prismaService: PrismaService) {}

  async findAll(res: Response, page: number = 1, limit: number = 10) {
    page = Math.max(page, 1);
    limit = Math.max(limit, 1);

    const skip = (page - 1) * limit; // Cálculo correcto de skip
    const take = limit;

    const [roles, total] = await Promise.all([
      this.prismaService.role.findMany({
        skip: skip,
        take: take,
        include: {
          UserRole: {
            include: {
              user: true,
            },
          },
          RolePermission: {
            include: {
              permission: true,
            },
          },
        },
      }),
      this.prismaService.role.count(),
    ]);

    res.set({
      'x-total-count': total,
      'x-current-page': page,
      'x-per-page': limit,
      'x-total-pages': Math.ceil(total / limit),
    });

    return res.json(roles);
  }

  async findById(id: number | string) {
    const roleId = Number(id);

    if (isNaN(roleId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    const role = await this.prismaService.role.findUnique({
      where: {
        id: roleId,
      },
      include: {
        UserRole: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                lastname: true,
              },
            },
          },
        },
        RolePermission: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`El rol con el id #${id} no se encuentra`);
    }

    return role;
  }

  async create(createRoleDto: CreateRoleDto) {
    return await this.prismaService.role.create({
      data: createRoleDto,
    });
  }

  async update(id: number | string, updateRoleDto: UpdateRoleDto) {
    const roleID = Number(id);

    if (isNaN(roleID)) {
      throw new BadRequestException(`El ID de rol proporcionado no es válido`);
    }

    const role = await this.prismaService.role.update({
      where: {
        id: roleID,
      },
      data: updateRoleDto,
    });

    if (!role) {
      throw new NotFoundException(`El rol con el id #${id} no existe`);
    }

    return role;
  }

  async assignRole(userId: number | string, roleId: number | string) {
    const userID = Number(userId);

    if (isNaN(userID)) {
      throw new BadRequestException(
        `El ID de usuario proporcionado no es válido`,
      );
    }

    const roleID = Number(roleId);

    if (isNaN(roleID)) {
      throw new BadRequestException(`El ID de rol proporcionado no es válido`);
    }

    const userRoleDb = await this.prismaService.userRole.findFirst({
      where: {
        roleId: roleID,
        userId: userID,
      },
    });

    if (userRoleDb) {
      throw new BadRequestException('Este usuario ya esta asignado a ese rol');
    }

    return await this.prismaService.userRole.create({
      data: {
        userId: userID,
        roleId: roleID,
      },
      include: {
        role: true,
        user: true,
      },
    });
  }

  async deassignRole(userId: number | string, roleId: number | string) {
    const userID = Number(userId);

    if (isNaN(userID)) {
      throw new BadRequestException(
        `El ID de usuario proporcionado no es válido`,
      );
    }

    const roleID = Number(roleId);

    if (isNaN(roleID)) {
      throw new BadRequestException(`El ID de rol proporcionado no es válido`);
    }

    const userRole = await this.prismaService.userRole.findFirst({
      where: {
        userId: userID,
        roleId: roleID,
      },
    });

    if (!userRole) {
      throw new NotFoundException(
        `El rol con el ID #${roleID} no está asignado al usuario con el ID #${userID}`,
      );
    }

    return await this.prismaService.userRole.delete({
      where: {
        id: userRole.id,
      },
      include: {
        role: true,
        user: true,
      },
    });
  }

  async deleteRole(id: number | string) {
    const roleID = Number(id);

    if (isNaN(roleID)) {
      throw new BadRequestException(`El ID de rol proporcionado no es válido`);
    }

    await this.prismaService.role.delete({
      where: {
        id: roleID,
      },
    });
  }
}
