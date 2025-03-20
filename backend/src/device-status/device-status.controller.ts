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
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiResponse } from 'src/custom.types';
import { CreateDeviceStatusDto } from './dto/create-device-status.dto';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { UpdateDeviceStatusDto } from './dto/update-device-status.dto';
import { PermissionsWithDescription } from 'decorators/permissionsWithDescription.decorator';
import { PermissionGuard } from 'src/auth/permission/permission.guard';

@Controller('device-status')
export class DeviceStatusController {
  constructor(private deviceStatusService: DeviceStatusService) {}

  @PermissionsWithDescription(
    ['device_statuses:all', 'device_statuses:list'],
    'Listar todos los estados de dispositivo',
  )
  @UseGuards(AuthGuard, PermissionGuard)
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

  @PermissionsWithDescription(
    ['device_statuses:all', 'device_statuses:show'],
    'Mostrar un estado de dispositivo por id',
  )
  @UseGuards(AuthGuard, PermissionGuard)
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

  @PermissionsWithDescription(
    ['device_statuses:all', 'device_statuses:create'],
    'Crear nuevo estado de dispositivo',
  )
  @UseGuards(AuthGuard, PermissionGuard)
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

  @PermissionsWithDescription(
    ['device_statuses:all', 'device_statuses:update'],
    'Actualizar estado de dispositivo por id',
  )
  @UseGuards(AuthGuard, PermissionGuard)
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

  @PermissionsWithDescription(
    ['device_statuses:all', 'device_statuses:delete'],
    'Eliminar un estado de dispositivo por id',
  )
  @UseGuards(AuthGuard, PermissionGuard)
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
