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
import { DevicesService } from './devices.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { ApiResponse } from 'src/custom.types';
import { CreateDeviceDto } from './dto/create-device.dto';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { RolesWithDescription } from 'decorators/rolesWithDescription.decorator';
import { RegisterEventDto } from './dto/register-event.dto';

@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @RolesWithDescription(['superadmin', 'admin'], '')
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get('list')
  async listAll(): Promise<ApiResponse> {
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

  @RolesWithDescription(['admin', 'superadmin'], '')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async listById(@Param('id') id: number): Promise<ApiResponse> {
    try {
      return {
        data: await this.devicesService.findById(id),
        error: null,
      };
    } catch (error) {
      return {
        error: error,
        data: null,
      };
    }
  }

  @RolesWithDescription(['superadmin', 'admin'], '')
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async create(@Body() createDeviceDto: CreateDeviceDto): Promise<ApiResponse> {
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

  @RolesWithDescription(['superadmin', 'admin'], '')
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Put('update/:id')
  async update(
    @Param('id') id: number,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ): Promise<ApiResponse> {
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

  @RolesWithDescription(['superadmin', 'admin'], '')
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('delete/:id')
  async delete(@Param('id') id: number): Promise<ApiResponse> {
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

  @RolesWithDescription(
    ['superadmin', 'admin'],
    'Esta operación asigna el dispositivo a un usuario y crea un nuevo registro en UserDevice',
  )
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('assign/user/:userId/device/:deviceId')
  async assign(
    @Param('userId') userId: number,
    @Param('deviceId') deviceId: number,
  ): Promise<ApiResponse> {
    try {
      return {
        data: await this.devicesService.assign(userId, deviceId),
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
            error: new BadRequestException(
              'Este usuario o dispositivo no existe',
            ),
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
    ['superadmin', 'admin'],
    'Esta operación des-asigna el dispositivo de un usuario y elimina un registro en UserDevice',
  )
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Delete('deassign/user/:userId/device/:deviceId')
  async deassign(
    @Param('userId') userId: number,
    @Param('deviceId') deviceId: number,
  ): Promise<ApiResponse> {
    try {
      return {
        data: await this.devicesService.deassign(userId, deviceId),
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
            error: new BadRequestException(
              'Este usuario o dispositivo no existe',
            ),
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
    ['superadmin', 'admin', 'usuario'],
    'Con esta operación se registra un nuevo evento en el dispositivo creando un nuevo registro en Event y DeviceHistory',
  )
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('/:deviceId/event/:eventTypeId')
  async registerEvent(
    @Param('deviceId') deviceId: number,
    @Param('eventTypeId') eventTypeId: number,
    @Body() registerEventDtop: RegisterEventDto,
  ): Promise<ApiResponse> {
    try {
      const status = registerEventDtop.status;
      return {
        data: await this.devicesService.regiterEvent(
          status,
          eventTypeId,
          deviceId,
        ),
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
      return {
        error,
        data: null,
      };
    }
  }
}
