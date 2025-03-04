import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from './token/token.module';

@Module({
  // TODO: QUITAR EL 'ConfigModule.forRoot()' EN PRODUCCIÓN
  imports: [AuthModule, UsersModule, PrismaModule, ConfigModule.forRoot(), TokenModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
