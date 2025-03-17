import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiResponse } from 'src/custom.types';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { PermissionsWithDescription } from 'decorators/permissionsWithDescription.decorator';
import { PermissionGuard } from 'src/auth/permission/permission.guard';

@Controller('module')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @PermissionsWithDescription(
    ['permissions:all', 'permissions:list'],
    'Listar todos los permisos actuales',
  )
  @UseGuards(AuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('list')
  async listAll(): Promise<ApiResponse> {
    try {
      return {
        data: await this.permissionService.findAll(),
        error: null,
      };
    } catch (error) {
      return {
        error,
        data: null,
      };
    }
  }

  @PermissionsWithDescription(
    ['permissions:all', 'permissions:show'],
    'Ver un permiso por id',
  )
  @UseGuards(AuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async listById(@Param('id') id: number): Promise<ApiResponse> {
    try {
      return {
        data: await this.permissionService.findById(id),
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
    ['permissions:all', 'permissions:assign'],
    'Asignar un rol a este permiso mediante la id de ambos',
  )
  @UseGuards(AuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('assign/permission/:permissionId/role/:roleId')
  async assign(
    @Param('permissionId') permissionId: number,
    @Param('roleId') roleId: number,
  ): Promise<ApiResponse> {
    try {
      return {
        data: await this.permissionService.assignRole(roleId, permissionId),
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
        if (error.code == '3002') {
          return {
            error: new BadRequestException('Este rol o permiso no existe'),
            data: null,
          };
        }
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

  @PermissionsWithDescription(
    ['permissions:all', 'permissions:deassign'],
    'Des-asignar un rol a este permiso mediante la id de ambos',
  )
  @UseGuards(AuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('deassign/permission/:permissionId/role/:roleId')
  async deassign(
    @Param('permissionId') permissionId: number,
    @Param('roleId') roleId: number,
  ): Promise<ApiResponse> {
    try {
      return {
        data: await this.permissionService.deassignRole(roleId, permissionId),
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
        if (error.code == '3002') {
          return {
            error: new BadRequestException('Este rol o permiso no existe'),
            data: null,
          };
        }
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
