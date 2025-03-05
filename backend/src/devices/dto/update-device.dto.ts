import { OmitType, PartialType } from '@nestjs/swagger';
import { DeviceBaseDto } from './device-base.dto';

export class UpdateDeviceDto extends PartialType(
  OmitType(DeviceBaseDto, [
    'id',
    'serialNumber',
    'createdAt',
    'updatedAt',
  ] as const),
) {}
