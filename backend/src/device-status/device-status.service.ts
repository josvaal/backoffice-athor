import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeviceStatusDto } from './dto/create-device-status.dto';
import { UpdateDeviceStatusDto } from './dto/update-device-status.dto';

@Injectable()
export class DeviceStatusService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.deviceStatus.findMany();
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
