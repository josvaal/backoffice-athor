import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { ApiResponse } from 'src/custom.types';
import { TokenExpiredError } from '@nestjs/jwt';

@Controller('token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @HttpCode(HttpStatus.OK)
  @Post('verify')
  async verify(@Headers('Authorization') auth: string): Promise<ApiResponse> {
    try {
      const token = auth.split(' ')[1];
      return {
        data: await this.tokenService.verifyToken(token),
        error: null,
      };
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

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Headers('Authorization') auth: string): Promise<ApiResponse> {
    try {
      const token = auth.split(' ')[1];
      return {
        data: await this.tokenService.refreshToken(token),
        error: null,
      };
    } catch (error) {
      return {
        error: error,
        data: null,
      };
    }
  }
}
