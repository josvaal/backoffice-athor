import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.event.findMany();
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
