import { Module } from '@nestjs/common';
import { DeviceStatusService } from './device-status.service';
import { DeviceStatusController } from './device-status.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { RoleGuard } from 'src/auth/role/role.guard';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [DeviceStatusService, RoleGuard],
  controllers: [DeviceStatusController],
  exports: [DeviceStatusService],
})
export class DeviceStatusModule {}
