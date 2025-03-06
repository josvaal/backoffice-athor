import { ApiProperty } from '@nestjs/swagger';

export class RegisterEventDto {
  @ApiProperty()
  status: boolean;
}
