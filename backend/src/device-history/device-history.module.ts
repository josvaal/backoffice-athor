import { Module } from '@nestjs/common';
import { DeviceHistoryService } from './device-history.service';
import { DeviceHistoryController } from './device-history.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [DeviceHistoryService],
  controllers: [DeviceHistoryController],
  exports: [DeviceHistoryService],
})
export class DeviceHistoryModule {}
