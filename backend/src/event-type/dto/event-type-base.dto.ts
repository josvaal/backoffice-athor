import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '@prisma/client';

export class EventTypeBaseDto implements EventType {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
