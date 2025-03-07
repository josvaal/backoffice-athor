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

  @RolesWithDescription(
    ['superadmin', 'admin'],
    'Esta operación de API permite a los usuarios con roles de "superadmin" o "admin" obtener una lista de todos los dispositivos, incluyendo detalles como su estado y modelo. La función recupera los dispositivos de la base de datos y los devuelve en una respuesta estructurada. Si ocurre algún error durante la consulta, se devuelve un mensaje de error adecuado.',
  )
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

  @RolesWithDescription(
    ['admin', 'superadmin'],
    'Esta operación de API permite a los usuarios con los roles de "admin" o "superadmin" obtener los detalles de un dispositivo específico mediante su ID. Incluye información sobre el estado, modelo, historial, y los usuarios asociados al dispositivo. Si el dispositivo no existe o el ID proporcionado no es válido, se devuelve un mensaje de error correspondiente.',
  )
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

  @RolesWithDescription(
    ['admin', 'superadmin'],
    'Esta operación de API permite a los usuarios con los roles de "admin" o "superadmin" buscar dispositivos utilizando la dirección MAC ESP32. Devuelve detalles del dispositivo, incluyendo su estado, modelo, historial y los usuarios asociados. Si no se encuentra ningún dispositivo con la MAC proporcionada, se genera un error indicando que no existe.',
  )
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('macESP32/:mac')
  async listByMacESP32(@Param('mac') mac: string): Promise<ApiResponse> {
    try {
      return {
        data: await this.devicesService.searchByMacESP32(mac),
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
    ['admin', 'superadmin'],
    'Esta operación de API permite a los usuarios con los roles de "admin" o "superadmin" buscar un dispositivo utilizando su número de serie. Si el dispositivo se encuentra, devuelve detalles sobre su estado, modelo, historial y usuarios asociados. Si no se encuentra el dispositivo con el número de serie proporcionado, se genera un error indicando que no existe.',
  )
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('serial/:serial')
  async findBySerialNumber(
    @Param('serial') serial: string,
  ): Promise<ApiResponse> {
    try {
      return {
        data: await this.devicesService.searchBySerialNumber(serial),
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
    ['admin', 'superadmin'],
    'Esta operación de API permite a los usuarios con los roles de "admin" o "superadmin" buscar dispositivos por su lote. Si se encuentran dispositivos con el lote proporcionado, se devuelve información detallada sobre su estado, modelo, historial y usuarios asociados. Si no se encuentra ningún dispositivo con ese lote, se genera un error indicando que no existen dispositivos con el lote especificado.',
  )
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('batch/:batch')
  async listByBatch(@Param('batch') batch: string): Promise<ApiResponse> {
    try {
      return {
        data: await this.devicesService.searchByBatch(batch),
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
    ['superadmin', 'admin'],
    'Esta operación de API permite a los usuarios con los roles "superadmin" o "admin" crear un nuevo dispositivo proporcionando los datos a través de createDeviceDto. Si la creación es exitosa, se devuelve la información del dispositivo creado, incluyendo detalles sobre el estado, modelo, superadministrador y usuarios asociados. Si ocurre un error, como datos inválidos o un número de serie duplicado, se retorna un mensaje de error adecuado. Además, se valida que todas las relaciones necesarias existan antes de la creación.',
  )
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

  @RolesWithDescription(
    ['superadmin', 'admin'],
    'Esta operación de API permite a los usuarios con los roles "superadmin" o "admin" actualizar la información de un dispositivo existente, excepto el número de serie, el cual no puede ser modificado. Al proporcionar el updateDeviceDto, el sistema valida la existencia del dispositivo por su ID y realiza la actualización de los datos. Si el dispositivo no se encuentra, se lanza un error de tipo "NotFound". En caso de errores de validación o problemas con los datos proporcionados, se retornan mensajes de error detallados.',
  )
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

  @RolesWithDescription(
    ['superadmin', 'admin'],
    'Esta operación de API permite a los usuarios con los roles "superadmin" o "admin" eliminar un dispositivo de la base de datos mediante su ID. Si el ID proporcionado no es válido, se devuelve un error de tipo "BadRequestException". Si el dispositivo con el ID especificado no se encuentra, se lanza una "NotFoundException". Si la eliminación es exitosa, se retorna un objeto con los datos del dispositivo eliminado. En caso de error, se captura y devuelve el error correspondiente.',
  )
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
