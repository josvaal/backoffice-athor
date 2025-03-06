import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<Role[]> {
    return await this.prismaService.role.findMany();
  }

  async findById(id: number | string): Promise<Role | null> {
    const roleId = Number(id);

    if (isNaN(roleId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    const role: Role | null = await this.prismaService.role.findUnique({
      where: {
        id: roleId,
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

    return await this.prismaService.userRole.create({
      data: {
        userId: userID,
        roleId: roleID,
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
