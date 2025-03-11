import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';
import { ApiResponse, JwtRequestPayload, JwtToken } from 'src/custom.types';
import { UserView } from 'src/users/dto/user-view.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    description:
      'Esta operación de API permite el inicio de sesión de un usuario, validando su correo y contraseña. Si la autenticación es exitosa, genera y devuelve dos tokens JWT (de acceso y de actualización). Si hay algún error, devuelve un mensaje de error correspondiente.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto): Promise<ApiResponse> {
    try {
      return {
        data: await this.authService.signIn(
          signInDto.email,
          signInDto.password,
        ),
        error: null,
      };
    } catch (error) {
      return {
        error,
        data: null,
      };
    }
  }

  @ApiOperation({
    description:
      'Esta operación de API permite el registro de un nuevo usuario, creando primero al usuario y asignándole el rol de "usuario" en una transacción. Si todo es exitoso, genera y devuelve dos tokens JWT (de acceso y de actualización). Si ocurre algún error durante la creación o asignación del rol, devuelve un mensaje de error.',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() signUpDto: SignUpDto): Promise<ApiResponse> {
    console.log(signUpDto);
    try {
      return {
        data: await this.authService.signUp(signUpDto),
        error: null,
      };
    } catch (error) {
      console.log({error})
      if(error instanceof TypeError){
        return {
          data: null,
          error: error
        }
      }
      return {
        data: null,
        error,
      };
    }
  }

  @ApiOperation({
    description:
      'Esta operación de API permite obtener el perfil del usuario autenticado. Al recibir una solicitud con un token JWT válido, busca al usuario en la base de datos. Si el usuario no existe, retorna un error; de lo contrario, devuelve los detalles del perfil, excluyendo la contraseña.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@Request() req: JwtRequestPayload): Promise<ApiResponse> {
    try {
      return {
        data: await this.authService.profile(req),
        error: null,
      };
    } catch (error) {
      return {
        error,
        data: null,
      };
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Solo se puede actualizar perfil cada 15 dias',
    description:
      'Esta operación de API permite actualizar el perfil del usuario autenticado, pero solo si han pasado al menos 15 días desde su última actualización. No se permite modificar el correo electrónico ni la contraseña. Si el usuario intenta actualizar el perfil antes de ese tiempo o con campos no permitidos, se devuelve un error. Si la actualización es exitosa, se devuelve la información del usuario actualizada.',
  })
  @Put('me')
  async updateProfile(
    @Request() req: JwtRequestPayload,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse> {
    try {
      return {
        data: await this.authService.update(req, updateUserDto),
        error: null,
      };
    } catch (error) {
      return {
        error,
        data: null,
      };
    }
  }
}
