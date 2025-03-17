import { Module } from '@nestjs/common';
import { DeviceModelService } from './device-model.service';
import { DeviceModelController } from './device-model.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PermissionGuard } from 'src/auth/permission/permission.guard';

//TODO: Hacer el CRUD de estado de dispositivos
@Module({
  imports: [PrismaModule, UsersModule],
  providers: [DeviceModelService, PermissionGuard],
  controllers: [DeviceModelController],
  exports: [DeviceModelService],
})
export class DeviceModelModule {}
