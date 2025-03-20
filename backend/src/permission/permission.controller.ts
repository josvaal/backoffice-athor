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
  Query,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiResponse, JwtRequestPayload } from 'src/custom.types';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { PermissionsWithDescription } from 'decorators/permissionsWithDescription.decorator';
import { PermissionGuard } from 'src/auth/permission/permission.guard';
import { ApiOperation } from '@nestjs/swagger';
import { Response as Res } from 'express';

@Controller('permissions')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @ApiOperation({ description: 'Esto retorna todos tus permisos actuales' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('/me')
  async listByMe(@Request() req: JwtRequestPayload): Promise<ApiResponse> {
    try {
      return {
        data: await this.permissionService.findPermissionsByMe(req),
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
    ['permissions:all', 'permissions:list', 'superadmin'],
    'Listar todos los permisos actuales',
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
        data: await this.permissionService.findAll(res, page, limit),
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
    ['permissions:all', 'permissions:show', 'superadmin'],
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
    ['permissions:all', 'permissions:list_by_user_id', 'superadmin'],
    'Listar los permisos mediante un id de rol',
  )
  @UseGuards(AuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/user/:userId')
  async listByUserId(
    @Param('userId') id: number | string,
  ): Promise<ApiResponse> {
    try {
      return {
        data: await this.permissionService.findPermissionsByUserId(id),
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
    ['permissions:all', 'permissions:assign', 'superadmin'],
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
    ['permissions:all', 'permissions:deassign', 'superadmin'],
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
