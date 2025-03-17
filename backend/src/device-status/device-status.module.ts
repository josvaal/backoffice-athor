import { Module } from '@nestjs/common';
import { DeviceStatusService } from './device-status.service';
import { DeviceStatusController } from './device-status.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { PermissionGuard } from 'src/auth/permission/permission.guard';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [DeviceStatusService, PermissionGuard],
  controllers: [DeviceStatusController],
  exports: [DeviceStatusService],
})
export class DeviceStatusModule {}
