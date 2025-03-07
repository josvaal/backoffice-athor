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
import { UserView } from './dto/user-view.dto';
const saltOrRounds: number = Number(process.env.SALTROUNDS);

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

  async findAll() {
    return await this.prismaService.user.findMany({
      include: {
        UserRole: {
          include: {
            role: true,
          },
        },
      },
    });
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

    return await this.prismaService.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
