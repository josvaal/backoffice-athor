import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserDevicesService } from './user-devices.service';
import { RolesWithDescription } from 'decorators/rolesWithDescription.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { ApiResponse } from 'src/custom.types';

@Controller('user-devices')
export class UserDevicesController {
  constructor(private userDevicesService: UserDevicesService) {}

  @RolesWithDescription(
    ['superadmin', 'admin'],
    "Esta operación de API permite obtener una lista de todos los dispositivos asignados a los usuarios. Solo los usuarios con los roles de 'superadmin' o 'admin' tienen acceso a esta acción. La respuesta incluye información detallada sobre el usuario y el dispositivo asociado a cada registro. En caso de error, se devuelve un mensaje de error apropiado.",
  )
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get('list')
  async listAll(): Promise<ApiResponse> {
    try {
      return {
        data: await this.userDevicesService.findAll(),
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
