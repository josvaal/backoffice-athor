import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

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

  async create(userDto: UserDto): Promise<User | null> {
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
      },
      select: {
        id: true,
        name: true,
        email: true,
        lastname: true,
        username: true,
        password: true,
      },
    });
  }
}
