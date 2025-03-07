import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DeviceStatusService } from './device-status.service';
import { RolesWithDescription } from 'decorators/rolesWithDescription.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { ApiResponse } from 'src/custom.types';
import { CreateDeviceStatusDto } from './dto/create-device-status.dto';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { UpdateDeviceStatusDto } from './dto/update-device-status.dto';

@Controller('device-status')
export class DeviceStatusController {
  constructor(private deviceStatusService: DeviceStatusService) {}

  @RolesWithDescription(
    ['superadmin'],
    "Esta operación de API permite obtener una lista de todos los estados de los dispositivos registrados en el sistema. Solo los usuarios con el rol de 'superadmin' pueden acceder a esta información. Si la solicitud es exitosa, se devuelve la lista de estados de los dispositivos, mientras que si ocurre algún error, se maneja y se devuelve una respuesta adecuada con el error.",
  )
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get('list')
  async listAll(): Promise<ApiResponse> {
    try {
      return {
        data: await this.deviceStatusService.findAll(),
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
    "Esta operación de API permite obtener un estado específico de dispositivo basado en su ID. Solo los usuarios con el rol de 'superadmin' pueden acceder a esta información. Si el ID proporcionado no es válido o el estado del dispositivo no se encuentra, se devuelve un error adecuado. En caso contrario, se devuelve el estado del dispositivo correspondiente al ID solicitado.",
  )
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async listById(@Param('id') id: number): Promise<ApiResponse> {
    try {
      return {
        data: await this.deviceStatusService.findById(id),
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
    "Esta operación de API permite crear un nuevo estado de dispositivo. Solo los usuarios con el rol de 'superadmin' pueden realizar esta acción. Si los datos enviados son incorrectos o el nombre de serie ya existe, se devuelve un error correspondiente. En caso contrario, se crea el estado de dispositivo y se devuelve una respuesta con los datos creados.",
  )
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async create(
    @Body() createDeviceStatusDto: CreateDeviceStatusDto,
  ): Promise<ApiResponse> {
    try {
      return {
        data: await this.deviceStatusService.create(createDeviceStatusDto),
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
    "Esta operación de API permite actualizar un estado de dispositivo existente. Solo los usuarios con el rol de 'superadmin' pueden realizar esta acción. Si el ID proporcionado no es válido o el estado de dispositivo no se encuentra, se devuelve un error correspondiente. Si los datos enviados son incorrectos, también se maneja el error. Si todo es válido, el estado de dispositivo se actualiza y se devuelve la respuesta con los datos actualizados.",
  )
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Put('update/:id')
  async update(
    @Param('id') id: number,
    @Body() updateDeviceStatusDto: UpdateDeviceStatusDto,
  ): Promise<ApiResponse> {
    try {
      return {
        data: await this.deviceStatusService.update(id, updateDeviceStatusDto),
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
          error: new NotFoundException(
            `El estado de dispositivo con ID #${id} no existe`,
          ),
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
    "Esta operación de API permite eliminar un estado de dispositivo identificado por su ID. Solo los usuarios con el rol de 'superadmin' pueden realizar esta acción. Si el ID proporcionado no es válido o el estado de dispositivo no existe, se devuelve un error adecuado. Si la eliminación es exitosa, se devuelve la respuesta con un mensaje de éxito.",
  )
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('delete/:id')
  async delete(@Param('id') id: number): Promise<ApiResponse> {
    try {
      return {
        data: await this.deviceStatusService.delete(id),
        error: null,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return {
          error: new NotFoundException(
            `El estado de dispositivo con ID #${id} no existe`,
          ),
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
