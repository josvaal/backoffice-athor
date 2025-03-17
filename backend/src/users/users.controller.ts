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
import { Response as Res } from 'express';
import { UserCreateDto } from './dto/user-create.dto';
import { PermissionGuard } from 'src/auth/permission/permission.guard';
import { PermissionsWithDescription } from 'decorators/permissionsWithDescription.decorator';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @PermissionsWithDescription(
    ['users:all', 'users:list'],
    'Listar todos los usuarios existentes',
  )
  @UseGuards(AuthGuard, PermissionGuard)
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

  @PermissionsWithDescription(
    ['users:all', 'users:update'],
    'Actualizar un usuario',
  )
  @UseGuards(AuthGuard, PermissionGuard)
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

  @PermissionsWithDescription(
    ['users:all', 'users:create'],
    'Crear un usuario nuevo',
  )
  @UseGuards(AuthGuard, PermissionGuard)
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

  @PermissionsWithDescription(
    ['users:all', 'users:show'],
    'Visualizar un usuario por id',
  )
  @UseGuards(AuthGuard, PermissionGuard)
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

  @PermissionsWithDescription(
    ['users:all', 'users:delete'],
    'Eliminar un usuario por id',
  )
  @UseGuards(AuthGuard, PermissionGuard)
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
