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
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles } from 'decorators/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { ApiResponse } from 'src/custom.types';
import { CreateRoleDto } from './dto/create-role.dto';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Roles('superadmin')
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get('list')
  async listAll(): Promise<ApiResponse> {
    try {
      return {
        data: await this.rolesService.findAll(),
        error: null,
      };
    } catch (error) {
      return {
        error,
        data: null,
      };
    }
  }

  @Roles('superadmin')
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async create(@Body() createRoleDto: CreateRoleDto): Promise<ApiResponse> {
    try {
      return {
        data: await this.rolesService.create(createRoleDto),
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

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return {
          error: new BadRequestException('El nombre de serie debe ser único'),
          data: null,
        };
      }
      return {
        error,
        data: null,
      };
    }
  }

  @Roles('superadmin')
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Put('update/:id')
  async update(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<ApiResponse> {
    try {
      return {
        data: await this.rolesService.update(id, updateRoleDto),
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
          error: new NotFoundException(`El rol con ID #${id} no existe`),
          data: null,
        };
      }

      return {
        error,
        data: null,
      };
    }
  }

  @Roles('superadmin')
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('assign/user/:userId/role/:roleId')
  async assign(
    @Param('userId') userId: number,
    @Param('roleId') roleId: number,
  ): Promise<ApiResponse> {
    try {
      return {
        data: await this.rolesService.assignRole(userId, roleId),
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
            error: new BadRequestException('Este usuario o rol no existe'),
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

  @Roles('superadmin')
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('deassign/user/:userId/role/:roleId')
  async deassign(
    @Param('userId') userId: number,
    @Param('roleId') roleId: number,
  ): Promise<ApiResponse> {
    try {
      return {
        data: await this.rolesService.deassignRole(userId, roleId),
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
            error: new BadRequestException('Este usuario o rol no existe'),
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

  @Roles('superadmin')
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('delete/:id')
  async deleteRole(@Param('id') id: number): Promise<ApiResponse> {
    try {
      return {
        data: await this.rolesService.deleteRole(id),
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
