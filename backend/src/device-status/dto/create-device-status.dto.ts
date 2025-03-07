import { OmitType } from '@nestjs/swagger';
import { DeviceStatusBaseDto } from './device-status-base.dto';

export class CreateDeviceStatusDto extends OmitType(DeviceStatusBaseDto, [
  'id',
] as const) {}
