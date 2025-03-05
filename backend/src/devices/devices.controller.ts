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
import { DevicesService } from './devices.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'decorators/roles.decorator';
import { ApiResponse } from 'src/custom.types';
import { Device } from '@prisma/client';
import { CreateDeviceDto } from './dto/create-device.dto';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Roles('superadmin', 'admin')
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get('list')
  async listAll(): Promise<ApiResponse<Device[]>> {
    try {
      return {
        data: await this.devicesService.findAll(),
        error: null,
      };
    } catch (error) {
      return {
        error,
        data: null,
      };
    }
  }

  @Roles('superadmin', 'admin')
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async create(
    @Body() createDeviceDto: CreateDeviceDto,
  ): Promise<ApiResponse<Device>> {
    try {
      return {
        data: await this.devicesService.create(createDeviceDto),
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
          error: new BadRequestException('El nro. de serie debe ser único'),
          data: null,
        };
      }

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        return {
          error: new BadRequestException('Todas las relaciones deben existir'),
          data: null,
        };
      }

      return {
        error,
        data: null,
      };
    }
  }

  @Roles('superadmin', 'admin')
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Put('update/:id')
  async update(
    @Param('id') id: number,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ): Promise<ApiResponse<Device>> {
    try {
      return {
        data: await this.devicesService.update(id, updateDeviceDto),
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
            `El dispositivo con ID #${id} no existe`,
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

  @Roles('superadmin')
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('delete/:id')
  async delete(@Param('id') id: number): Promise<ApiResponse<Device>> {
    try {
      return {
        data: await this.devicesService.deleteById(id),
        error: null,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return {
          error: new NotFoundException(
            `El dispositivo con ID #${id} no existe`,
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
