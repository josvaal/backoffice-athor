import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserSignupDto } from './dto/user-signup.dto';
import * as bcrypt from 'bcrypt';
import { UserUpdateDto } from './dto/user-update.dto';
import { ApiResponse } from 'src/custom.types';
import { UserView } from './dto/user-view.dto';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

const saltOrRounds: number = Number(process.env.SALTROUNDS);

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findById(id: number): Promise<User | null> {
    const user: User | null = await this.prismaService.user.findUnique({
      where: {
        id,
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
  async findByEmail(email: string): Promise<User | null> {
    const userFound: User | null = await this.prismaService.user.findUnique({
      where: {
        email,
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
      const hashPass = await bcrypt.hash(userSignupDto.password, saltOrRounds);
      return await this.prismaService.user.create({
        data: { ...userSignupDto, password: hashPass },
      });
    } catch (error) {
      console.log({ error });
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException(
            `El tipo de usuario con el id #${userSignupDto.userTypeId} no existe`,
          );
        }
        throw new InternalServerErrorException(error.message);
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Error desconocido');
    }
  }

  async findAll(): Promise<ApiResponse<UserView[]>> {
    try {
      const users: UserView[] = await this.prismaService.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          lastname: true,
          username: true,
          userTypeId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return {
        data: users,
        error: null,
      };
    } catch (error) {
      return {
        error: error,
        data: null,
      };
    }
  }

  async update(
    id: number | string,
    userUpdateDto: UserUpdateDto,
  ): Promise<ApiResponse<User>> {
    try {
      const userId = Number(id);

      if (isNaN(userId)) {
        throw new BadRequestException(`El ID proporcionado no es válido`);
      }

      if (userUpdateDto['password']) {
        throw new BadRequestException('No se permite actualizar la contraseña');
      }

      const user: User = await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: userUpdateDto as UserUpdateDto,
      });

      if (!user) {
        throw new NotFoundException(`El usuario con el id #${id} no existe`);
      }

      return {
        error: null,
        data: user,
      };
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        return {
          error: new BadRequestException('Error en los datos enviados'),
          data: null,
        };
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return {
          error: new NotFoundException(`El usuario con ID #${id} no existe`),
          data: null,
        };
      }
      return {
        error: error,
        data: null,
      };
    }
  }
}
