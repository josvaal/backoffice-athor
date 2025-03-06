import { OmitType, PartialType } from '@nestjs/swagger';
import { DeviceModelBaseDto } from './device-model-base.dto';

export class UpdateModelDeviceDto extends PartialType(
  OmitType(DeviceModelBaseDto, ['id', 'createdAt', 'updatedAt'] as const),
) {}
