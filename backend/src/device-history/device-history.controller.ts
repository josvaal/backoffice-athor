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

  @RolesWithDescription(['superadmin', 'admin'], '')
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
