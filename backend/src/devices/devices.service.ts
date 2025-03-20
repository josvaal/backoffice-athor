import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Response } from 'express';

@Injectable()
export class DevicesService {
  constructor(private prismaService: PrismaService) {}

  async findAll(res: Response, page: number = 1, limit: number = 10) {
    page = Math.max(page, 1);
    limit = Math.max(limit, 1);

    const skip = (page - 1) * limit; // Cálculo correcto de skip
    const take = limit;

    const [devices, total] = await Promise.all([
      this.prismaService.device.findMany({
        skip: skip,
        take: take,
        include: {
          model: true,
          users: true,
          DeviceHistory: true,
        },
      }),
      this.prismaService.device.count(),
    ]);

    res.set({
      'Access-Control-Expose-Headers': 'x-total-count',
      'x-total-count': total,
      'x-current-page': page,
      'x-per-page': limit,
      'x-total-pages': Math.ceil(total / limit),
    });

    return res.json(devices);
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

  async searchByMacESP32(mac: string) {
    const device = await this.prismaService.device.findMany({
      where: {
        macESP32: mac,
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
        `Los dispositivos con la mac ${mac} no existe`,
      );
    }

    return device;
  }

  async searchBySerialNumber(serial: string) {
    const device = await this.prismaService.device.findUnique({
      where: {
        serialNumber: serial,
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
        `El dispositivo con el numero de serie ${serial} no existe`,
      );
    }

    return device;
  }

  async searchByBatch(batch: string) {
    const device = await this.prismaService.device.findMany({
      where: {
        batch,
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
        `Los dispositivos con el lote ${batch} no existe`,
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

  async regiterEvent(
    status: boolean,
    eventTypeId: number | string,
    deviceId: number | string,
  ) {
    const eventTypeID = Number(eventTypeId);

    if (isNaN(eventTypeID)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    const deviceID = Number(deviceId);

    if (isNaN(deviceID)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    const deviceHistory = await this.prismaService.$transaction(
      async (prisma) => {
        const eventCreated = await this.prismaService.event.create({
          data: {
            status,
            eventTypeId: eventTypeID,
          },
        });
        if (!eventCreated) {
          throw new InternalServerErrorException('Error al crear el evento');
        }
        const deviceHistory = await this.prismaService.deviceHistory.create({
          data: {
            triggered: new Date(),
            deviceId: deviceID,
            eventId: eventCreated.id,
          },
          include: {
            event: {
              include: {
                eventType: true,
              },
            },
          },
        });
        if (!deviceHistory) {
          throw new InternalServerErrorException(
            'Error al registrar el evento',
          );
        }
        return deviceHistory;
      },
    );

    return deviceHistory;
  }
}
