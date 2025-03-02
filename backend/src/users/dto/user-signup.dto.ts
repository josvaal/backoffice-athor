import { User } from '@prisma/client';

export type UserSignupDto = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
