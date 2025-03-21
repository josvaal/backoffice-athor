import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}

  async findAll(res: Response, page: number = 1, limit: number = 10) {
    page = Math.max(page, 1);
    limit = Math.max(limit, 1);

    const skip = (page - 1) * limit; // Cálculo correcto de skip
    const take = limit;

    const [events, total] = await Promise.all([
      this.prismaService.event.findMany({
        skip: skip,
        take: take,
        include: {
          eventType: true,
        },
      }),
      this.prismaService.event.count(),
    ]);

    res.set({
      'Access-Control-Expose-Headers': 'x-total-count',
      'x-total-count': total,
      'x-current-page': page,
      'x-per-page': limit,
      'x-total-pages': Math.ceil(total / limit),
    });

    return res.json(events);
  }

  async findById(id: number | string) {
    const eventId = Number(id);

    if (isNaN(eventId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    const event = await this.prismaService.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        eventType: true,
      },
    });

    return event;
  }

  async deleteEvent(id: number | string) {
    const eventId = Number(id);

    if (isNaN(eventId)) {
      throw new BadRequestException(
        `El ID de devento proporcionado no es válido`,
      );
    }

    await this.prismaService.event.delete({
      where: {
        id: eventId,
      },
    });
  }
}
