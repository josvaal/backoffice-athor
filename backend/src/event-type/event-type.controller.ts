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
import { EventTypeService } from './event-type.service';
import { RolesWithDescription } from 'decorators/rolesWithDescription.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { ApiResponse } from 'src/custom.types';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { UpdateEventTypeDto } from './dto/update-event-type.dto';

@Controller('event-type')
export class EventTypeController {
  constructor(private eventTypeService: EventTypeService) {}

  @RolesWithDescription(
    ['admin', 'superadmin'],
    'Esta operación de API permite a los usuarios con roles de "admin" o "superadmin" obtener una lista de todos los tipos de eventos disponibles. Si la solicitud es exitosa, devuelve la información solicitada; si ocurre algún error, lo captura y lo devuelve en la respuesta.',
  )
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get('list')
  async listAll(): Promise<ApiResponse> {
    try {
      return {
        data: await this.eventTypeService.findAll(),
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
    'Esta operación de API permite obtener un tipo de evento específico a partir de su ID. Si el ID proporcionado no es válido o el tipo de evento no se encuentra en la base de datos, se lanzan errores adecuados. Si se encuentra el tipo de evento, se devuelve la información correspondiente.',
  )
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async listById(@Param('id') id: number): Promise<ApiResponse> {
    try {
      return {
        data: await this.eventTypeService.findById(id),
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
    "Esta operación de API permite crear un nuevo tipo de evento en el sistema. Si los datos proporcionados son incorrectos o el nombre del tipo de evento ya existe, se devuelve un error. Si todo está correcto, se crea el tipo de evento y se devuelve la información correspondiente. Solo los usuarios con roles de 'admin' o 'superadmin' pueden realizar esta operación.",
  )
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async create(
    @Body() createEventTypeDto: CreateEventTypeDto,
  ): Promise<ApiResponse> {
    try {
      return {
        data: await this.eventTypeService.create(createEventTypeDto),
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
          error: new BadRequestException('El nombre debe ser único'),
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
    ['admin', 'superadmin'],
    "Esta operación de API permite actualizar un tipo de evento existente en el sistema, identificando el tipo de evento por su ID. Si el ID proporcionado es inválido o el tipo de evento no se encuentra, se devuelve un error. Solo los usuarios con roles de 'admin' o 'superadmin' pueden realizar esta operación. Si todo es correcto, el tipo de evento se actualiza con los nuevos datos proporcionados.",
  )
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.CREATED)
  @Put('update/:id')
  async update(
    @Param('id') id: number,
    @Body() updateEventTypeDto: UpdateEventTypeDto,
  ): Promise<ApiResponse> {
    try {
      return {
        data: await this.eventTypeService.update(id, updateEventTypeDto),
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
            `El tipo de evento con ID #${id} no existe`,
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
    ['admin', 'superadmin'],
    "Esta operación de API permite eliminar un tipo de evento del sistema utilizando su ID. Solo los usuarios con roles de 'admin' o 'superadmin' pueden realizar esta acción. Si el ID proporcionado no es válido o el tipo de evento no se encuentra, se devuelve un error adecuado. Si la eliminación es exitosa, se responde con el tipo de evento eliminado, mientras que si ocurre algún error, se maneja de acuerdo con el tipo de problema encontrado, como errores en los datos enviados o problemas internos del servidor.",
  )
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('delete/:id')
  async deleteEventType(@Param('id') id: number): Promise<ApiResponse> {
    try {
      return {
        data: await this.eventTypeService.deleteEventType(id),
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
