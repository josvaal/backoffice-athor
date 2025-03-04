import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ApiResponse, JwtPayload, JwtToken } from 'src/custom.types';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async verifyToken(token: string): Promise<ApiResponse<JwtPayload>> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      return { error: null, data: payload };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return {
          error: new UnauthorizedException('Token expirado'),
          data: null,
        };
      }
      return {
        error: new UnauthorizedException('Token inválido'),
        data: null,
      };
    }
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<JwtToken>> {
    try {
      const decoded =
        await this.jwtService.verifyAsync<JwtPayload>(refreshToken);
      const user = await this.usersService.findById(Number(decoded.sub));

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const newPayload: JwtPayload = { sub: user.id.toString(), user };

      return {
        error: null,
        data: {
          access_token: await this.jwtService.signAsync(newPayload),
          refresh_token: await this.jwtService.signAsync(
            { sub: user.id },
            { expiresIn: '7d' },
          ),
        },
      };
    } catch (error) {
      return {
        error: new UnauthorizedException('Refresh token inválido'),
        data: null,
      };
    }
  }
}
