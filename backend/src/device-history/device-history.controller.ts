import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { DeviceHistoryService } from './device-history.service';
import { RolesWithDescription } from 'decorators/rolesWithDescription.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { ApiResponse } from 'src/custom.types';

@Controller('device-history')
export class DeviceHistoryController {
  constructor(private deviceHistoryService: DeviceHistoryService) {}

  @RolesWithDescription(
    ['superadmin', 'admin'],
    "Esta operación de API permite obtener un historial de dispositivos, incluyendo detalles sobre cada dispositivo y el evento relacionado, con información adicional sobre el tipo de evento. Solo los usuarios con los roles de 'superadmin' o 'admin' pueden acceder a esta información. En caso de éxito, la respuesta incluirá los datos solicitados; si ocurre algún error, se devolverá un mensaje de error adecuado.",
  )
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get('list')
  async listAll(): Promise<ApiResponse> {
    try {
      return {
        data: await this.deviceHistoryService.findAll(),
        error: null,
      };
    } catch (error) {
      return {
        error,
        data: null,
      };
    }
  }
}
