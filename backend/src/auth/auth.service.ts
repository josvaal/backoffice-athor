import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user: User | null = await this.usersService.findByEmail(email);

    const isMatch = await bcrypt.compare(pass, user?.password as string);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user?.id, email: user?.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(userDto: UserDto): Promise<any> {
    const user: User | null = await this.usersService.create(userDto);
    const payload = { sub: user?.id, email: user?.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
