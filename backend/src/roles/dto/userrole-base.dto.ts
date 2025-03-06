import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserRoleBase implements UserRole {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  roleId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
