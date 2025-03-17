import {
  BadRequestException,
  Body,
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
import { RolesWithDescription } from 'decorators/rolesWithDescription.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { ApiResponse } from 'src/custom.types';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Controller('module')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @RolesWithDescription(['superadmin'], 'Listar todos los permisos del sistema')
  @UseGuards(AuthGuard, RoleGuard)
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

  @RolesWithDescription(['superadmin'], 'Ver un permiso del sistema.')
  @UseGuards(AuthGuard)
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

  @RolesWithDescription(
    ['superadmin'],
    'Operación para asignar un rol a este permiso',
  )
  @UseGuards(AuthGuard, RoleGuard)
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

  @RolesWithDescription(
    ['superadmin'],
    'Operación para desasignar un rol a este permiso',
  )
  @UseGuards(AuthGuard, RoleGuard)
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
