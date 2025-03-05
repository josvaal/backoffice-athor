import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserUpdateDto } from './dto/user-update.dto';
import { ApiResponse } from 'src/custom.types';
import { User } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { UserView } from './dto/user-view.dto';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  // @Roles('superadmin', 'admin')
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get('list')
  async listAll(): Promise<ApiResponse<UserView[]>> {
    try {
      return {
        data: await this.userService.findAll(),
        error: null,
      };
    } catch (error) {
      return {
        error: error,
        data: null,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Put('update/:id')
  async updateProfile(
    @Param('id') id: number,
    @Body() userUpdateDto: UserUpdateDto,
  ): Promise<ApiResponse<User>> {
    try {
      return {
        data: await this.userService.update(id, userUpdateDto),
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
          error: new NotFoundException(`El usuario con ID #${id} no existe`),
          data: null,
        };
      }
      return {
        error: error,
        data: null,
      };
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async listById(@Param('id') id: number): Promise<ApiResponse<any>> {
    try {
      return {
        data: await this.userService.findById(id),
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
