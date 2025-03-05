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
import { UserUpdateDto } from './dto/user-update.dto';
import { UserView } from './dto/user-view.dto';
const saltOrRounds: number = Number(process.env.SALTROUNDS);

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findById(id: number | string): Promise<User | null> {
    const userId = Number(id);

    if (isNaN(userId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    const user: User | null = await this.prismaService.user.findUnique({
      where: {
        id: userId,
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

  async findAll(): Promise<UserView[]> {
    return await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        lastname: true,
        username: true,
        userTypeId: true,
        createdAt: true,
        updatedAt: true,
        devices: true,
        UserRole: {
          include: {
            role: true,
          },
        },
        userType: true
      },
    });
  }

  async update(
    id: number | string,
    userUpdateDto: UserUpdateDto,
  ): Promise<User> {
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

    const user: User = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: userUpdateDto as UserUpdateDto,
    });

    if (!user) {
      throw new NotFoundException(`El usuario con el id #${id} no existe`);
    }

    return user;
  }
}
