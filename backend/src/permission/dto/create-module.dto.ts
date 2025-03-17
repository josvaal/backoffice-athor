import { OmitType } from '@nestjs/swagger';
import { PermissionBaseDto } from './permission-base.dto';

export class CreatePermissionDto extends OmitType(PermissionBaseDto, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {}
