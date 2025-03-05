import { Module } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRoleController } from './user-role.controller';

@Module({
  providers: [UserRoleService, PrismaService],
  exports: [UserRoleService],
  controllers: [UserRoleController],
})
export class UserRoleModule {}
