import { OmitType } from '@nestjs/swagger';
import { RoleBaseDto } from './role-base.dto';

export class UpdateRoleDto extends OmitType(RoleBaseDto, [
  'id',
  'name',
  'createdAt',
  'updatedAt',
] as const) {}
