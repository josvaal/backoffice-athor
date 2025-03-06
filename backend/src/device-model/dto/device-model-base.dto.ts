import { ApiProperty } from '@nestjs/swagger';
import { DeviceModel } from '@prisma/client';

export class DeviceModelBaseDto implements DeviceModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
