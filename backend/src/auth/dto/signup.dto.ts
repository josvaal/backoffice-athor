import { OmitType } from '@nestjs/swagger';
import { UserBaseDto } from 'src/users/dto/user-base.dto';

export class SignUpDto extends OmitType(UserBaseDto, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {}
