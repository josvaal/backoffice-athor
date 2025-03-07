import { OmitType, PartialType } from '@nestjs/swagger';
import { DeviceStatusBaseDto } from './device-status-base.dto';

export class UpdateDeviceStatusDto extends PartialType(
  OmitType(DeviceStatusBaseDto, ['id'] as const),
) {}
