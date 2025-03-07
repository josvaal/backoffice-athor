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

  @RolesWithDescription(['superadmin', 'admin'], '')
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
