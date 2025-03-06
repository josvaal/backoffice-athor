import { Module } from '@nestjs/common';
import { DeviceModelService } from './device-model.service';
import { DeviceModelController } from './device-model.controller';
import { UsersModule } from 'src/users/users.module';
import { RoleGuard } from 'src/auth/role/role.guard';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [DeviceModelService, RoleGuard],
  controllers: [DeviceModelController],
  exports: [DeviceModelService],
})
export class DeviceModelModule {}
