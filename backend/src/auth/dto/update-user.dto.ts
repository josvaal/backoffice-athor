import { OmitType, PartialType } from '@nestjs/swagger';
import { UserBaseDto } from './user-base.dto';

export class UpdateUserDto extends PartialType(
  OmitType(UserBaseDto, ['id', 'password', 'email'] as const),
) {}
