import { OmitType } from '@nestjs/swagger';
import { RoleBaseDto } from './role-base.dto';

export class CreateRoleDto extends OmitType(RoleBaseDto, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {}
