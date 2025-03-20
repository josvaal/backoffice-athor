import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { PermissionGuard } from 'src/auth/permission/permission.guard';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [EventsService, PermissionGuard],
  controllers: [EventsController],
  exports: [EventsService],
})
export class EventsModule {}
