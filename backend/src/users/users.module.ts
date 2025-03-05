import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';
import { UserRoleModule } from 'src/user-role/user-role.module';
import { RoleGuard } from 'src/auth/role/role.guard';

@Module({
  imports: [PrismaModule, UserRoleModule],
  providers: [UsersService, RoleGuard],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
