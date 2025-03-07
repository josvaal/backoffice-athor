import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DeviceHistoryService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.deviceHistory.findMany({
      include: {
        device: true,
        event: {
          include: {
            eventType: true,
          },
        },
      },
    });
  }
}
