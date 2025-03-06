import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import { UpdateEventTypeDto } from './dto/update-event-type.dto';

@Injectable()
export class EventTypeService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.eventType.findMany();
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

    await this.prismaService.eventType.delete({
      where: {
        id: eventTypeId,
      },
    });
  }
}
