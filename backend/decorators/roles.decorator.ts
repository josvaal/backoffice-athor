import { SetMetadata } from '@nestjs/common';

// Define a constant key to store the roles metadata
export const ROLES_KEY = 'roles';

// Create the decorator to pass roles to the guard
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
