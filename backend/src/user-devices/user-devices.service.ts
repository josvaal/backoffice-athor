import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserDevicesService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.userDevice.findMany({
      include: {
        user: true,
        device: true,
      },
    });
  }
}
