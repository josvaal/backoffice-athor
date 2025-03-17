import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { PermissionGuard } from 'src/auth/permission/permission.guard';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [DevicesService, PermissionGuard],
  controllers: [DevicesController],
  exports: [DevicesService],
})
export class DevicesModule {}
