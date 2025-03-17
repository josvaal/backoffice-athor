import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Permissions } from './permissions.decorator';

export function PermissionsWithDescription(
  permissions: string[],
  description: string,
) {
  const summary = `Operación accesible con los permisos: ${permissions.join(', ')}`;

  return applyDecorators(
    Permissions(...permissions),
    ApiOperation({ summary, description }),
  );
}
