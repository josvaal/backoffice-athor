import { Module } from '@nestjs/common';
import { PermissionGuard } from 'src/auth/permission/permission.guard';
import { UsersService } from 'src/users/users.service';
import { DashboardController } from './dashboard.controller';

@Module({})
export class DashboardModule {
  providers: [UsersService, PermissionGuard];
  controllers: [DashboardController];
}
