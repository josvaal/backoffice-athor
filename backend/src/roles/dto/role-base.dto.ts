import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RoleBaseDto implements Role {
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
