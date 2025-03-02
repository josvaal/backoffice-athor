import { User } from '@prisma/client';

export type UserDto = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
