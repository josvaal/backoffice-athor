import { OmitType } from '@nestjs/swagger';
import { UserBaseDto } from './user-base.dto';

export class UserSignupDto extends OmitType(UserBaseDto, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {}
