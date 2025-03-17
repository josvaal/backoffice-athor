import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { UsersModule } from 'src/users/users.module';
import { PermissionGuard } from 'src/auth/permission/permission.guard';

@Module({
  imports: [UsersModule],
  providers: [TokenService, PermissionGuard],
  controllers: [TokenController],
})
export class TokenModule {}
