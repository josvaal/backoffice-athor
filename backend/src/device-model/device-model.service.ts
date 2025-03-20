import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateModelDeviceDto } from './dto/create-model-device.dto';
import { UpdateModelDeviceDto } from './dto/update-model-device.dto';
import { Response } from 'express';

@Injectable()
export class DeviceModelService {
  constructor(private prismaService: PrismaService) {}

  async findAll(res: Response, page: number = 1, limit: number = 10) {
    page = Math.max(page, 1);
    limit = Math.max(limit, 1);

    const skip = (page - 1) * limit; // Cálculo correcto de skip
    const take = limit;

    const [device_models, total] = await Promise.all([
      this.prismaService.deviceModel.findMany({
        skip: skip,
        take: take,
      }),
      this.prismaService.deviceModel.count(),
    ]);

    res.set({
      'Access-Control-Expose-Headers': 'x-total-count',
      'x-total-count': total,
      'x-current-page': page,
      'x-per-page': limit,
      'x-total-pages': Math.ceil(total / limit),
    });

    return res.json(device_models);
  }

  async findById(id: number | string) {
    const deviceModelId = Number(id);

    if (isNaN(deviceModelId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    const deviceModel = await this.prismaService.deviceModel.findUnique({
      where: {
        id: deviceModelId,
      },
    });

    if (!deviceModel) {
      throw new NotFoundException(
        `El dispositivo con el id ${deviceModelId} no existe`,
      );
    }

    return deviceModel;
  }

  async create(createModelDeviceDto: CreateModelDeviceDto) {
    return await this.prismaService.deviceModel.create({
      data: createModelDeviceDto,
    });
  }

  async update(
    id: number | string,
    updateModelDeviceDto: UpdateModelDeviceDto,
  ) {
    const modelDeviceId = Number(id);

    if (isNaN(modelDeviceId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    const modelDevice = await this.prismaService.deviceModel.update({
      where: {
        id: modelDeviceId,
      },
      data: updateModelDeviceDto,
    });

    if (!modelDevice) {
      throw new NotFoundException(
        `El modelo de dispositivo con el id #${id} no existe`,
      );
    }

    return modelDevice;
  }

  async delete(id: number | string) {
    const modelDeviceId = Number(id);

    if (isNaN(modelDeviceId)) {
      throw new BadRequestException(`El ID proporcionado no es válido`);
    }

    return await this.prismaService.deviceModel.delete({
      where: {
        id: modelDeviceId,
      },
    });
  }
}
