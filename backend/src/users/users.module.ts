import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';
import { PermissionGuard } from 'src/auth/permission/permission.guard';

@Module({
  imports: [PrismaModule],
  providers: [UsersService, PermissionGuard],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
