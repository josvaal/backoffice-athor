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
}
