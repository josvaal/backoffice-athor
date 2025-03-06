import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Roles } from './roles.decorator';

export function RolesWithDescription(roles: string[], description: string) {
  const summary = `Operación protegida por los roles: ${roles.join(', ')}`;

  return applyDecorators(
    Roles(...roles), // Aplicar decorador de roles
    ApiOperation({ summary, description }), // Aplicar ApiOperation con el summary dinámico
  );
}
