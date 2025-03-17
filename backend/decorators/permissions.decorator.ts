import { SetMetadata } from '@nestjs/common';

// Define a constant key to store the roles metadata
export const PERMISSIONS_KEY = 'permissions';

// Create the decorator to pass roles to the guard
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
