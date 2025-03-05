import { OmitType } from '@nestjs/swagger';
import { DeviceBaseDto } from './device-base.dto';

export class CreateDeviceDto extends OmitType(DeviceBaseDto, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {}
