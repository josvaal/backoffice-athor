import { OmitType } from '@nestjs/swagger';
import { DeviceModelBaseDto } from './device-model-base.dto';

export class CreateModelDeviceDto extends OmitType(DeviceModelBaseDto, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {}
