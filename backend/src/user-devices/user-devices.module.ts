import { Module } from '@nestjs/common';
import { UserDevicesService } from './user-devices.service';
import { UserDevicesController } from './user-devices.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [UserDevicesService],
  controllers: [UserDevicesController],
  exports: [UserDevicesService],
})
export class UserDevicesModule {}
