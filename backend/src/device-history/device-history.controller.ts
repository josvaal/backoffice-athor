import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Response,
  UseGuards,
} from '@nestjs/common';
import { DeviceHistoryService } from './device-history.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiResponse } from 'src/custom.types';
import { PermissionsWithDescription } from 'decorators/permissionsWithDescription.decorator';
import { PermissionGuard } from 'src/auth/permission/permission.guard';
import { Response as Res } from 'express';

@Controller('device_histories')
export class DeviceHistoryController {
  constructor(private deviceHistoryService: DeviceHistoryService) {}

  @PermissionsWithDescription(
    ['device_histories:all', 'device_histories:list', 'superadmin'],
    'Listar los historiales de dispositivo',
  )
  @UseGuards(AuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('list')
  async listAll(
    @Response() res: Res,
    @Query('_page') page: number,
    @Query('_limit') limit: number,
  ): Promise<ApiResponse> {
    try {
      return {
        data: await this.deviceHistoryService.findAll(res, page, limit),
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
    ['device_models:all', 'device_histories:show', 'superadmin'],
    'Mostrar modelo de dispositivo por id',
  )
  @UseGuards(AuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async listById(@Param('id') id: number): Promise<ApiResponse> {
    try {
      return {
        data: await this.deviceHistoryService.findById(id),
        error: null,
      };
    } catch (error) {
      return {
        error: error,
        data: null,
      };
    }
  }
}
