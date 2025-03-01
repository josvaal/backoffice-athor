import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const userFound: User | null = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!userFound) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return userFound;
  }
}
