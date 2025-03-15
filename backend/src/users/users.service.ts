import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserSignupDto } from './dto/user-signup.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user';
import { Response } from 'express';
import { UserCreateDto } from './dto/user-create.dto';
import { ApiResponse } from 'src/custom.types';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findById(id: number | string) {
    const userId = Number(id);

    if (isNaN(userId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    //TODO: Arreglar el tipado
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        UserRole: {
          include: {
            role: true,
          },
        },
        devices: {
          include: {
            device: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(
        `El usuario con el id #${id} no se encuentra`,
      );
    }

    return user;
  }

  //TODO: Dependiente de auth service (register y login)
  async findByEmail(email: string) {
    const userFound = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        UserRole: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!userFound) {
      throw new NotFoundException(`El usuario con el email ${email} no existe`);
    }

    return userFound;
  }

  //TODO: Dependiente de auth service (register)
  async create(userSignupDto: UserSignupDto): Promise<User | null> {
    try {
      const saltOrRounds: number = Number(process.env.SALTROUNDS);
      const hashPass = await bcrypt.hash(userSignupDto.password, saltOrRounds);
      return await this.prismaService.user.create({
        data: { ...userSignupDto, password: hashPass },
      });
    } catch (error) {
      console.log({ error });
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Error desconocido');
    }
  }

  async createUser(userCreateDto: UserCreateDto): Promise<ApiResponse> {
    try {
      const saltOrRounds: number = Number(process.env.SALTROUNDS);
      const hashPass = await bcrypt.hash(userCreateDto.password, saltOrRounds);
      userCreateDto.password = hashPass;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userDb = await this.prismaService.$transaction(async (prisma) => {
        const { roleId, ...restUserData } = userCreateDto;
        const role = await this.prismaService.role.findUnique({
          where: {
            id: roleId,
          },
        });

        if (!role) {
          throw new NotFoundException('No existe este rol');
        }

        const userCreated = await this.prismaService.user.create({
          data: restUserData,
        });

        if (!userCreated) {
          throw new InternalServerErrorException('Error al crear el usuario');
        }

        const assigned = await this.prismaService.userRole.create({
          data: {
            userId: userCreated.id,
            roleId: roleId,
          },
        });

        if (!assigned) {
          throw new InternalServerErrorException(
            'Error al asignar el rol al usuario',
          );
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...restUserCreated } = userCreated;
        return restUserCreated;
      });
      return {
        data: userDb,
        error: null,
      };
    } catch (error) {
      console.log({ error });
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Error desconocido');
    }
  }

  async findAll(res: Response, page: number = 1, limit: number = 10) {
    page = Math.max(page, 1);
    limit = Math.max(limit, 1);

    const skip = (page - 1) * limit; // Cálculo correcto de skip
    const take = limit;

    const [users, total] = await Promise.all([
      this.prismaService.user.findMany({
        skip: skip,
        take: take,
        include: {
          UserRole: {
            include: {
              role: true,
            },
          },
        },
      }),
      this.prismaService.user.count(),
    ]);

    res.set({
      'x-total-count': total,
      'x-current-page': page,
      'x-per-page': limit,
      'x-total-pages': Math.ceil(total / limit),
    });

    return res.json(users);
  }

  async update(id: number | string, userUpdateDto: UpdateUserDto) {
    const userId = Number(id);

    if (isNaN(userId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    if (userUpdateDto['password']) {
      throw new BadRequestException('No se permite actualizar la contraseña');
    }

    if (userUpdateDto['email']) {
      throw new BadRequestException('No se permite actualizar el correo');
    }

    const user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      include: {
        UserRole: {
          include: {
            role: true,
          },
        },
      },
      data: userUpdateDto,
    });

    if (!user) {
      throw new NotFoundException(`El usuario con el id #${id} no existe`);
    }

    return user;
  }

  async delete(id: number | string) {
    const userId = Number(id);

    if (isNaN(userId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    return await this.prismaService.$transaction(async (prisma) => {
      const userRolesDeleted = await this.prismaService.userRole.deleteMany({
        where: {
          userId: userId,
        },
      });

      if (!userRolesDeleted) {
        throw new InternalServerErrorException(
          'No se pudo eliminar la relación rol-usuario',
        );
      }

      return await this.prismaService.user.delete({
        where: {
          id: userId,
        },
      });
    });
  }
}
