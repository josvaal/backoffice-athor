import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import { UpdateEventTypeDto } from './dto/update-event-type.dto';
import { Response } from 'express';

@Injectable()
export class EventTypeService {
  constructor(private prismaService: PrismaService) {}

  async findAll(res: Response, page: number = 1, limit: number = 10) {
    page = Math.max(page, 1);
    limit = Math.max(limit, 1);

    const skip = (page - 1) * limit; // Cálculo correcto de skip
    const take = limit;

    const [event_types, total] = await Promise.all([
      this.prismaService.eventType.findMany({
        skip: skip,
        take: take,
        include: {
          Event: true,
        },
      }),
      this.prismaService.eventType.count(),
    ]);

    res.set({
      'Access-Control-Expose-Headers': 'x-total-count',
      'x-total-count': total,
      'x-current-page': page,
      'x-per-page': limit,
      'x-total-pages': Math.ceil(total / limit),
    });

    return res.json(event_types);
  }

  async findById(id: number | string) {
    const eventTypeId = Number(id);

    if (isNaN(eventTypeId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    const eventType = await this.prismaService.eventType.findUnique({
      where: {
        id: eventTypeId,
      },
    });

    if (!eventType) {
      throw new NotFoundException(
        `El tipo de evento con el id ${eventTypeId} no existe`,
      );
    }

    return eventType;
  }

  async create(createEventTypeDto: CreateEventTypeDto) {
    return await this.prismaService.eventType.create({
      data: createEventTypeDto,
    });
  }

  async update(id: number | string, updateEventTypeDto: UpdateEventTypeDto) {
    const eventTypeId = Number(id);

    if (isNaN(eventTypeId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    const eventType = await this.prismaService.eventType.update({
      where: {
        id: eventTypeId,
      },
      data: updateEventTypeDto,
    });

    if (!eventType) {
      throw new NotFoundException(
        `El tipo de evento con el id #${id} no existe`,
      );
    }

    return eventType;
  }

  async deleteEventType(id: number | string) {
    const eventTypeId = Number(id);

    if (isNaN(eventTypeId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    return await this.prismaService.eventType.delete({
      where: {
        id: eventTypeId,
      },
    });
  }
}
