import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserBaseDto } from './user-base.dto';

export class UserCreateDto extends OmitType(UserBaseDto, [
  'id',
  'username',
  'createdAt',
  'updatedAt',
] as const) {
  @ApiProperty()
  roleId: number;
}
