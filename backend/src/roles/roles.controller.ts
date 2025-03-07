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
import { RolesWithDescription } from 'decorators/rolesWithDescription.decorator';
import { ApiOperation } from '@nestjs/swagger';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @RolesWithDescription(
    ['superadmin'],
    'Esta operación de API permite a los usuarios con el rol de "superadmin" obtener una lista de todos los roles disponibles en el sistema. Utiliza los guardias de autenticación y roles para asegurarse de que solo los usuarios con el rol adecuado puedan acceder a esta información. Si la operación es exitosa, devuelve la lista de roles; si ocurre un error, devuelve un mensaje de error.',
  )
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

  @RolesWithDescription(
    ['superadmin'],
    'Esta operación de API permite a los usuarios con el rol de "superadmin" obtener los detalles de un rol específico por su ID. Valida que el ID proporcionado sea correcto y busca el rol en la base de datos, incluyendo los usuarios asociados a ese rol. Si el rol no existe o el ID es inválido, se devuelve un mensaje de error. Si la consulta es exitosa, se devuelve la información del rol.',
  )
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async listById(@Param('id') id: number): Promise<ApiResponse> {
    try {
      return {
        data: await this.rolesService.findById(id),
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
    'Esta operación de API permite a los usuarios con el rol de "superadmin" crear un nuevo rol en el sistema. Al recibir los datos del rol, valida la información y la guarda en la base de datos. Si hay errores en los datos enviados o si el nombre del rol ya existe, devuelve un mensaje de error. Si la creación es exitosa, devuelve la información del rol creado.',
  )
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

  @RolesWithDescription(
    ['superadmin'],
    'Esta operación de API permite a los usuarios con el rol de "superadmin" actualizar un rol existente en el sistema. Valida que el ID proporcionado sea correcto y actualiza los datos del rol en la base de datos. Si el rol no existe o los datos son incorrectos, se devuelve un mensaje de error. Si la actualización es exitosa, se devuelve la información del rol actualizado.',
  )
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

  @RolesWithDescription(
    ['superadmin'],
    'Esta operación de API permite a los usuarios con el rol de "superadmin" asignar un rol específico a un usuario. Valida que los IDs proporcionados para el usuario y el rol sean correctos, y si ambos existen, crea la asignación en la base de datos. Si ocurre un error, como un ID inválido o si el usuario o rol no existen, se devuelve un mensaje de error adecuado. Si la asignación es exitosa, se devuelve la información de la asignación.',
  )
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

  @RolesWithDescription(
    ['superadmin'],
    'Esta operación de API permite a los usuarios con el rol de "superadmin" quitar un rol asignado a un usuario. Valida que los IDs del usuario y del rol sean correctos, y verifica si la asignación existe en la base de datos. Si la asignación no se encuentra, devuelve un error, y si la eliminación es exitosa, la asignación es eliminada y se devuelve la información correspondiente.',
  )
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

  @RolesWithDescription(
    ['superadmin'],
    'Esta operación de API permite a los usuarios con el rol de "superadmin" eliminar un rol específico. Valida que el ID del rol proporcionado sea correcto y, si es válido, procede a eliminar el rol de la base de datos. En caso de error, como datos inválidos o problemas en la eliminación, se devuelve un mensaje de error adecuado.',
  )
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
