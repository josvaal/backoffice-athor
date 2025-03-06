import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";

export class UserBaseDto implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  lastname: string;

  @ApiProperty({
    description: "puede ser string o nulo"
  })
  username: string | null;
}