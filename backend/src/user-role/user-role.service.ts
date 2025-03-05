import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRoleService {
  constructor(private prismaService: PrismaService) {}

  async findRolesByUserId(id: number | string): Promise<Role[]> {
    const userId = Number(id);

    if (isNaN(userId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { UserRole: { include: { role: true } } },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const roles = user.UserRole.map((userRole) => userRole.role);

    if (roles.length === 0) {
      throw new NotFoundException(`El usuario no tiene roles asignados`);
    }

    return roles;
  }
}
