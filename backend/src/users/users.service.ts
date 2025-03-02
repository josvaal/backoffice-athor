import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserSignupDto } from './dto/user-signup.dto';
import * as bcrypt from 'bcrypt';
import { UserUpdateDto } from './dto/user-update.dto';

const saltOrRounds: number = Number(process.env.SALTROUNDS);

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const userFound: User | null = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!userFound) {
      throw new NotFoundException(
        `El usuario con el email ${email} no se encuentra registrado`,
      );
    }

    return userFound;
  }

  async create(userDto: UserSignupDto): Promise<User | null> {
    const userFound: User | null = await this.prismaService.user.findUnique({
      where: {
        email: userDto.email,
      },
    });

    if (userFound) {
      throw new ConflictException(
        `El usuario con el correo ${userFound.email} ya se encuentra registrado`,
      );
    }
    const hashPass: string = await bcrypt.hash(userDto.password, saltOrRounds);

    return this.prismaService.user.create({
      data: {
        email: userDto.email,
        password: hashPass,
        name: userDto.name,
        lastname: userDto.lastname,
        username: userDto.username,
        userTypeId: userDto.userTypeId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        lastname: true,
        username: true,
        password: true,
        createdAt: true,
        updatedAt: true,
        userTypeId: true,
      },
    });
  }

  async findAll() {
    return this.prismaService.user.findMany;
  }

  async update(id: number, userUpdateDto: UserUpdateDto): Promise<User | null> {
    const userFound = await this.prismaService.user.update({
      where: {
        id,
      },
      data: userUpdateDto,
    });

    if (!userFound) {
      throw new NotFoundException(`El usuario con el #${id} no se encontró`);
    }

    return userFound;
  }
}
