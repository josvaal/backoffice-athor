import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PermissionsWithDescription } from 'decorators/permissionsWithDescription.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionGuard } from 'src/auth/permission/permission.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private jwtService: JwtService) {}

  @PermissionsWithDescription(
    ['dashboard:all', 'dashboard:show', 'superadmin'],
    'Mostrar el dashboard',
  )
  @UseGuards(AuthGuard, PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('show')
  show(): string {
    return 'http://localhost:3001/public/dashboard/fc43956c-f1c6-431e-adc0-6999da8810f7#theme=night&background=true&bordered=false&titled=false';
  }
}
