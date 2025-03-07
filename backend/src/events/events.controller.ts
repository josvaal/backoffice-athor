import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RolesWithDescription } from 'decorators/rolesWithDescription.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { ApiResponse } from 'src/custom.types';
import { EventsService } from './events.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @RolesWithDescription(
    ['superadmin', 'admin'],
    "Esta operación de API permite obtener una lista de todos los eventos registrados. Solo los usuarios con los roles de 'superadmin' o 'admin' pueden acceder a esta información. Si la solicitud es exitosa, se devuelve la lista de eventos, mientras que si ocurre un error, se maneja y se retorna el error correspondiente.",
  )
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get('list')
  async listAll(): Promise<ApiResponse> {
    try {
      return {
        data: await this.eventsService.findAll(),
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
    ['superadmin', 'admin'],
    "Esta operación de API permite obtener los detalles de un evento específico a través de su ID. Los usuarios con roles de 'superadmin' o 'admin' pueden acceder a la información. Si el ID proporcionado es válido, se retorna la información del evento, incluyendo el tipo de evento asociado. Si ocurre un error, se maneja y se devuelve el mensaje de error correspondiente.",
  )
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async listById(@Param('id') id: number): Promise<ApiResponse> {
    try {
      return {
        data: await this.eventsService.findById(id),
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
    "Esta operación de API permite eliminar un evento a través de su ID. Solo los usuarios con el rol de 'superadmin' pueden realizar esta acción. Si el ID proporcionado es válido, el evento será eliminado. Si el evento está relacionado con un historial de eventos y no puede ser eliminado, se devuelve un mensaje de error específico. Si ocurre cualquier otro tipo de error, también se maneja y se retorna el mensaje adecuado.",
  )
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('delete/:id')
  async deleteEvent(@Param('id') id: number): Promise<ApiResponse> {
    try {
      return {
        data: await this.eventsService.deleteEvent(id),
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
        if (error.code == 'P2003') {
          return {
            error: new BadRequestException(
              'Este evento está asignado en el historial de eventos, no puede ser eliminado',
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
}
