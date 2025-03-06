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
import { DevicesService } from './devices/devices.service';
import { DevicesModule } from './devices/devices.module';
import { EventTypeModule } from './event-type/event-type.module';
import { DeviceModelModule } from './device-model/device-model.module';

@Module({
  // TODO: QUITAR EL 'ConfigModule.forRoot()' EN PRODUCCIÓN
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    ConfigModule.forRoot(),
    TokenModule,
    RolesModule,
    DevicesModule,
    EventTypeModule,
    DeviceModelModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, DevicesService],
})
export class AppModule {}
