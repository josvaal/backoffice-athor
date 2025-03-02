import { User } from '@prisma/client';
import { UserSignupDto } from './user-signup.dto';

export type UserUpdateDto = Partial<UserSignupDto>;
