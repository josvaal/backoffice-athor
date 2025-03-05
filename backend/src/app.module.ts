import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from './token/token.module';
import { RolesModule } from './roles/roles.module';
import { UserRoleModule } from './user-role/user-role.module';
import { DevicesService } from './devices/devices.service';
import { DevicesModule } from './devices/devices.module';

@Module({
  // TODO: QUITAR EL 'ConfigModule.forRoot()' EN PRODUCCIÓN
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    ConfigModule.forRoot(),
    TokenModule,
    RolesModule,
    UserRoleModule,
    DevicesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, DevicesService],
})
export class AppModule {}
