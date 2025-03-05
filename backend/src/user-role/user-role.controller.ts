import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiResponse } from 'src/custom.types';
import { UserRoleService } from './user-role.service';

@Controller('user-role')
export class UserRoleController {
  constructor(private userRoleService: UserRoleService) {}

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('user/:id')
  async getRolesByUserId(
    @Param('id') id: number,
  ): Promise<ApiResponse<Role[]>> {
    try {
      return {
        data: await this.userRoleService.findRolesByUserId(id),
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
