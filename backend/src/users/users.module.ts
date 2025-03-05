import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';
import { RoleGuard } from 'src/auth/role/role.guard';

@Module({
  imports: [PrismaModule],
  providers: [UsersService, RoleGuard],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
