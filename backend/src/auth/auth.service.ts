import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserSignupDto } from 'src/users/dto/user-signup.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import {
  ApiResponse,
  JwtPayload,
  JwtRequestPayload,
  JwtToken,
} from 'src/custom.types';
import { UserView } from 'src/users/dto/user-view.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<JwtToken> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'El usuario con este correo no se encuentra registrado',
      );
    }

    const isMatch = await bcrypt.compare(pass, user?.password as string);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = {
      sub: user?.id.toString() as string,
      user: user as User,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(
        { sub: user?.id },
        { expiresIn: '7d' },
      ),
    };
  }

  async signUp(userDto: UserSignupDto): Promise<JwtToken> {
    const user = await this.prismaService.$transaction(async (prisma) => {
      const userCreated = await this.usersService.create(userDto);
      if (!userCreated) {
        throw new InternalServerErrorException('Error al crear el usuario');
      }
      const roleUser = await this.prismaService.userRole.create({
        data: {
          //TODO: El rol de usuario siempre tiene que tener el ID "1"
          roleId: 1,
          userId: userCreated.id,
        },
      });

      if (!roleUser) {
        throw new InternalServerErrorException('Error al asignar el rol');
      }
      return userCreated;
    });

    const payload: JwtPayload = {
      sub: user.id.toString() as string,
      user: user,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(
        { sub: user?.id },
        { expiresIn: '7d' },
      ),
    };
  }

  async profile(request: JwtRequestPayload): Promise<UserView> {
    console.log(request);
    const userJwt: User = request.user.user;
    const userDb: User | null = await this.usersService.findById(userJwt.id);

    if (!userDb) {
      throw new NotFoundException(
        `El usuario con el id #${userJwt.id} no existe`,
      );
    }
    const { password, ...userView } = userDb;

    return userView;
  }
}
