import { OmitType, PartialType } from '@nestjs/swagger';
import { PermissionBaseDto } from './permission-base.dto';

export class UpdatePermissionDto extends PartialType(
  OmitType(PermissionBaseDto, [
    'id',
    'name',
    'createdAt',
    'updatedAt',
  ] as const),
) {}
