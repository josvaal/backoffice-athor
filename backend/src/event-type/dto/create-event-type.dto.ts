import { OmitType } from '@nestjs/swagger';
import { EventTypeBaseDto } from './event-type-base.dto';

export class CreateEventTypeDto extends OmitType(EventTypeBaseDto, [
  'id',
] as const) {}
