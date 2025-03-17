import { Module } from '@nestjs/common';
import { EventTypeService } from './event-type.service';
import { EventTypeController } from './event-type.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { PermissionGuard } from 'src/auth/permission/permission.guard';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [EventTypeService, PermissionGuard],
  controllers: [EventTypeController],
  exports: [EventTypeService],
})
export class EventTypeModule {}
