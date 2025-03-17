import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RolesController } from './roles.controller';
import { UsersModule } from 'src/users/users.module';
import { PermissionGuard } from 'src/auth/permission/permission.guard';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [RolesService, PermissionGuard],
  exports: [RolesService],
  controllers: [RolesController],
})
export class RolesModule {}
