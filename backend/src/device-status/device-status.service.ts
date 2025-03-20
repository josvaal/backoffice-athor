import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeviceStatusDto } from './dto/create-device-status.dto';
import { UpdateDeviceStatusDto } from './dto/update-device-status.dto';
import { Response } from 'express';

@Injectable()
export class DeviceStatusService {
  constructor(private prismaService: PrismaService) {}

  async findAll(res: Response, page: number = 1, limit: number = 10) {
    page = Math.max(page, 1);
    limit = Math.max(limit, 1);

    const skip = (page - 1) * limit; // Cálculo correcto de skip
    const take = limit;

    const [device_statuses, total] = await Promise.all([
      this.prismaService.deviceStatus.findMany({
        skip: skip,
        take: take,
      }),
      this.prismaService.deviceStatus.count(),
    ]);

    res.set({
      'Access-Control-Expose-Headers': 'x-total-count',
      'x-total-count': total,
      'x-current-page': page,
      'x-per-page': limit,
      'x-total-pages': Math.ceil(total / limit),
    });

    return res.json(device_statuses);
  }

  async findById(id: number | string) {
    const deviceStatusId = Number(id);

    if (isNaN(deviceStatusId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    const deviceStatus = await this.prismaService.deviceStatus.findUnique({
      where: {
        id: deviceStatusId,
      },
    });

    if (!deviceStatus) {
      throw new NotFoundException(
        `El estado de dispositivo con el id ${deviceStatusId} no existe`,
      );
    }

    return deviceStatus;
  }

  async create(createDeviceStatusDto: CreateDeviceStatusDto) {
    return await this.prismaService.deviceStatus.create({
      data: createDeviceStatusDto,
    });
  }

  async update(
    id: number | string,
    updateDeviceStatusDto: UpdateDeviceStatusDto,
  ) {
    const deviceStatusId = Number(id);

    if (isNaN(deviceStatusId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    const deviceStatus = await this.prismaService.deviceStatus.update({
      where: {
        id: deviceStatusId,
      },
      data: updateDeviceStatusDto,
    });

    if (!deviceStatus) {
      throw new NotFoundException(
        `El modelo de dispositivo con el id #${id} no existe`,
      );
    }

    return deviceStatus;
  }

  async delete(id: number | string) {
    const deviceStatusId = Number(id);

    if (isNaN(deviceStatusId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    return await this.prismaService.deviceStatus.delete({
      where: {
        id: deviceStatusId,
      },
    });
  }
}
