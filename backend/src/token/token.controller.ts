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
import { ApiOperation } from '@nestjs/swagger';

@Controller('token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @ApiOperation({
    description:
      'Esta operación de API permite verificar la validez de un token JWT proporcionado en el encabezado de autorización. Si no se proporciona un token, se lanza un error. Al recibir el token, intenta verificar su validez y, si es exitoso, devuelve los datos correspondientes. Si el token ha expirado o es inválido, devuelve un error de autorización adecuado, indicando si el token ha expirado o si es inválido.',
  })
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

  @ApiOperation({
    description:
      'Esta operación de API permite refrescar los tokens de acceso y actualización. Al recibir un token de actualización válido, lo verifica y, si el usuario existe, genera nuevos tokens JWT (de acceso y de actualización). Si ocurre algún error, como un token inválido o un usuario no encontrado, se devuelve un error de autorización. Si la operación es exitosa, se devuelven los nuevos tokens.',
  })
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
