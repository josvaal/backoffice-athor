import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { RoleGuard } from 'src/auth/role/role.guard';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRoleModule } from 'src/user-role/user-role.module';

@Module({
  imports: [PrismaModule, UserRoleModule],
  providers: [DevicesService, RoleGuard],
  controllers: [DevicesController],
  exports: [DevicesService],
})
export class DevicesModule {}
