import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Device } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Injectable()
export class DevicesService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.device.findMany({
      include: {
        superAdmin: true,
        status: true,
        model: true,
        users: true,
        //TODO: Array de historial del dispositivo
        DeviceHistory: true,
      },
    });
  }

  async findById(id: number | string) {
    const deviceId = Number(id);

    if (isNaN(deviceId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    const device = await this.prismaService.device.findUnique({
      where: {
        id: deviceId,
      },
      include: {
        superAdmin: true,
        status: true,
        model: true,
        users: true,
        //TODO: Array de historial del dispositivo
        DeviceHistory: true,
      },
    });

    if (!device) {
      throw new NotFoundException(
        `El dispositivo con el id ${deviceId} no existe`,
      );
    }

    return device;
  }

  async create(createDeviceDto: CreateDeviceDto) {
    return await this.prismaService.device.create({
      data: createDeviceDto,
      include: {
        superAdmin: true,
        status: true,
        model: true,
        users: true,
      },
    });
  }

  async update(id: number | string, updateDeviceDto: UpdateDeviceDto) {
    const deviceId = Number(id);

    if (isNaN(deviceId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    if (updateDeviceDto['serialNumber']) {
      throw new BadRequestException(
        'No se permite actualizar el nro. de serie',
      );
    }

    const device = await this.prismaService.device.update({
      data: updateDeviceDto,
      where: {
        id: deviceId,
      },
      include: {
        superAdmin: true,
        status: true,
        model: true,
        users: true,
      },
    });

    if (!device) {
      throw new NotFoundException(`El dispositivo con el id #${id} no existe`);
    }

    return device;
  }

  async deleteById(id: number | string) {
    const deviceId = Number(id);

    if (isNaN(deviceId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    return await this.prismaService.device.delete({
      where: {
        id: deviceId,
      },
    });
  }

  async assign(userId: number | string, deviceId: number | string) {
    const userID = Number(userId);

    if (isNaN(userID)) {
      throw new BadRequestException(
        `El ID de usuario proporcionado no es válido`,
      );
    }

    const deviceID = Number(deviceId);

    if (isNaN(deviceID)) {
      throw new BadRequestException(`El ID de rol proporcionado no es válido`);
    }

    return await this.prismaService.userDevice.create({
      data: {
        userId: userID,
        deviceId: deviceID,
      },
      include: {
        device: true,
        user: true,
      },
    });
  }

  async deassign(userId: number | string, deviceId: number | string) {
    const userID = Number(userId);

    if (isNaN(userID)) {
      throw new BadRequestException(
        `El ID de usuario proporcionado no es válido`,
      );
    }

    const deviceID = Number(deviceId);

    if (isNaN(deviceID)) {
      throw new BadRequestException(`El ID de rol proporcionado no es válido`);
    }

    const userDevice = await this.prismaService.userDevice.findFirst({
      where: {
        userId: userID,
        deviceId: deviceID,
      },
    });

    if (!userDevice) {
      throw new NotFoundException(
        `El dispositivo con el ID #${deviceID} no está asignado al usuario con el ID #${userID}`,
      );
    }

    return await this.prismaService.userDevice.delete({
      where: {
        id: userDevice.id,
      },
      include: {
        device: true,
        user: true,
      },
    });
  }
}
