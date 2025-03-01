import { User } from "@prisma/client";

export type SignUpDto = Omit<User, 'id'>