import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DeviceHistoryService {
  constructor(private prismaService: PrismaService) {}

  async findAll(res: Response, page: number = 1, limit: number = 10) {
    page = Math.max(page, 1);
    limit = Math.max(limit, 1);

    const skip = (page - 1) * limit; // Cálculo correcto de skip
    const take = limit;

    const [device_histories, total] = await Promise.all([
      this.prismaService.deviceHistory.findMany({
        skip: skip,
        take: take,
        include: {
          device: {
            include: {
              model: true,
            },
          },
          event: {
            include: {
              eventType: true,
            },
          },
        },
      }),
      this.prismaService.deviceHistory.count(),
    ]);

    res.set({
      'Access-Control-Expose-Headers': 'x-total-count',
      'x-total-count': total,
      'x-current-page': page,
      'x-per-page': limit,
      'x-total-pages': Math.ceil(total / limit),
    });

    return res.json(device_histories);
  }

  async findById(id: number | string) {
    const deviceHistoryId = Number(id);

    if (isNaN(deviceHistoryId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    const deviceHistory = await this.prismaService.deviceHistory.findUnique({
      where: {
        id: deviceHistoryId,
      },
      include: {
        device: {
          include: {
            model: true,
          },
        },
        event: {
          include: {
            eventType: true,
          },
        },
      },
    });

    if (!deviceHistory) {
      throw new NotFoundException(
        `El historial con el id ${deviceHistoryId} no existe`,
      );
    }

    return deviceHistory;
  }
}
