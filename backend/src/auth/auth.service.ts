import {
  Injectable,
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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<ApiResponse<JwtToken>> {
    try {
      const user: User | null = await this.usersService.findByEmail(email);

      const isMatch = await bcrypt.compare(pass, user?.password as string);
      if (!isMatch) {
        throw new UnauthorizedException();
      }

      const payload: JwtPayload = {
        sub: user?.id.toString() as string,
        user: user as User,
      };

      return {
        error: null,
        data: {
          access_token: await this.jwtService.signAsync(payload),
          refresh_token: await this.jwtService.signAsync(
            { sub: user?.id },
            { expiresIn: '7d' },
          ),
        },
      };
    } catch (error) {
      return {
        error: error,
        data: null,
      };
    }
  }

  async signUp(userDto: UserSignupDto): Promise<ApiResponse<JwtToken>> {
    try {
      const user = await this.usersService.create(userDto);
      const payload: JwtPayload = {
        sub: user?.id.toString() as string,
        user: user as User,
      };

      return {
        error: null,
        data: {
          access_token: await this.jwtService.signAsync(payload),
          refresh_token: await this.jwtService.signAsync(
            { sub: user?.id },
            { expiresIn: '7d' },
          ),
        },
      };
    } catch (error) {
      return {
        error: error,
        data: null,
      };
    }
  }

  async profile(request: JwtRequestPayload): Promise<ApiResponse<User>> {
    try {
      console.log(request);
      const userJwt: User = request.user.user;
      const userDb: User | null = await this.usersService.findById(userJwt.id);

      if (!userDb) {
        throw new NotFoundException(
          `El usuario con el id #${userJwt.id} no existe`,
        );
      }

      return {
        error: null,
        data: userDb,
      };
    } catch (error) {
      return {
        error: error,
        data: null,
      };
    }
  }
}
