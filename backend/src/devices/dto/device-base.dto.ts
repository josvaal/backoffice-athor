import { ApiProperty } from '@nestjs/swagger';
import { Device } from '@prisma/client';

export class DeviceBaseDto implements Device {
  @ApiProperty()
  id: number;

  @ApiProperty()
  batch: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  macBluetooth: string;

  @ApiProperty()
  macESP32: string;

  @ApiProperty()
  modelId: number;

  @ApiProperty()
  relayQuantity: number;

  @ApiProperty()
  serialNumber: string;

  @ApiProperty()
  statusId: number;

  @ApiProperty()
  superAdminId: number;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  version: string;
}
