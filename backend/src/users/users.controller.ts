import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Response,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './dto/update-user';
import { ApiResponse } from 'src/custom.types';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { RolesWithDescription } from 'decorators/rolesWithDescription.decorator';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Response as Res } from 'express';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserCreateDto } from './dto/user-create.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @RolesWithDescription(
    ['admin', 'superadmin'],
    'Esta operación de API permite a los usuarios con roles de "admin" o "superadmin" obtener una lista de todos los usuarios. Se asegura de que el solicitante esté autenticado y tenga el rol adecuado mediante los guardias de autenticación y roles. Si la solicitud es exitosa, devuelve la lista de usuarios; de lo contrario, devuelve un mensaje de error.',
  )
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get('list')
  async listAll(
    @Response() res: Res,
    @Query('_page') page: number,
    @Query('_limit') limit: number,
  ): Promise<ApiResponse> {
    try {
      return {
        data: await this.userService.findAll(res, page, limit),
        error: null,
      };
    } catch (error) {
      return {
        error: error,
        data: null,
      };
    }
  }

  @RolesWithDescription(
    ['admin', 'superadmin'],
    'Esta operación de API permite a los usuarios con roles de "admin" o "superadmin" actualizar los datos de un usuario específico, pero no se permite modificar la contraseña ni el correo electrónico. Valida que el ID proporcionado sea correcto y que el usuario exista en la base de datos. Si ocurre algún error en los datos enviados o el usuario no se encuentra, devuelve un mensaje de error correspondiente. Si la actualización es exitosa, devuelve la información del usuario actualizada.',
  )
  @UseGuards(AuthGuard, RoleGuard)
  @Put('update/:id')
  async updateProfile(
    @Param('id') id: number,
    @Body() userUpdateDto: UpdateUserDto,
  ): Promise<ApiResponse> {
    try {
      return {
        data: await this.userService.update(id, userUpdateDto),
        error: null,
      };
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        return {
          error: new BadRequestException('Error en los datos enviados'),
          data: null,
        };
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return {
          error: new NotFoundException(`El usuario con ID #${id} no existe`),
          data: null,
        };
      }
      return {
        error: error,
        data: null,
      };
    }
  }

  @RolesWithDescription(
    ['superadmin'],
    'Operacion restringida por superadmins, esta ruta permite crear usuarios',
  )
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async createUser(@Body() userCreateDto: UserCreateDto): Promise<ApiResponse> {
    try {
      return {
        data: await this.userService.createUser(userCreateDto),
        error: null,
      };
    } catch (error) {
      return {
        error: error,
        data: null,
      };
    }
  }

  @RolesWithDescription(
    ['admin', 'superadmin'],
    'Esta operación de API permite a los usuarios con roles de "admin" o "superadmin" obtener los detalles de un usuario específico por su ID. Valida que el ID proporcionado sea correcto y busca al usuario en la base de datos, incluyendo sus roles y dispositivos asociados. Si el usuario no existe o el ID es inválido, se devuelve un mensaje de error. Si la consulta es exitosa, se devuelve la información del usuario.',
  )
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async listById(@Param('id') id: number): Promise<ApiResponse> {
    try {
      return {
        data: await this.userService.findById(id),
        error: null,
      };
    } catch (error) {
      return {
        error: error,
        data: null,
      };
    }
  }

  @RolesWithDescription(
    ['superadmin'],
    'Esta operación de API permite a los usuarios con el rol de "superadmin" eliminar un usuario por su ID. Valida que el ID proporcionado sea correcto y, si el usuario existe, lo elimina de la base de datos. Si ocurre algún error en los datos enviados o durante la eliminación, se devuelve un mensaje de error adecuado.',
  )
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('delete/:id')
  async delete(@Param('id') id: number): Promise<ApiResponse> {
    try {
      return {
        data: await this.userService.delete(id),
        error: null,
      };
    } catch (error) {
      console.log({ error });
      if (error instanceof PrismaClientValidationError) {
        return {
          error: new BadRequestException('Error en los datos enviados'),
          data: null,
        };
      }

      if (error instanceof PrismaClientKnownRequestError) {
        return {
          error: new InternalServerErrorException(error.message),
          data: null,
        };
      }
      return {
        error,
        data: null,
      };
    }
  }
}
