import { OmitType } from '@nestjs/swagger';
import { UserRoleBase } from './userrole-base.dto';

export class AssignRoleDto extends OmitType(UserRoleBase, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {}
