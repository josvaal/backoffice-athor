import { OmitType, PartialType } from '@nestjs/swagger';
import { UserBaseDto } from './user-base.dto';

export class UserUpdateDto extends PartialType(
  OmitType(UserBaseDto, [
    'id',
    'password',
    'createdAt',
    'updatedAt',
    'email',
  ] as const),
) {}
