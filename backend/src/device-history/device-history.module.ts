import { Module } from '@nestjs/common';
import { DeviceHistoryService } from './device-history.service';
import { DeviceHistoryController } from './device-history.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { PermissionGuard } from 'src/auth/permission/permission.guard';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [DeviceHistoryService, PermissionGuard],
  controllers: [DeviceHistoryController],
  exports: [DeviceHistoryService],
})
export class DeviceHistoryModule {}
