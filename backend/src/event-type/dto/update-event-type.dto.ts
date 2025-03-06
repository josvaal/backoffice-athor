import { OmitType, PartialType } from '@nestjs/swagger';
import { EventTypeBaseDto } from './event-type-base.dto';

export class UpdateEventTypeDto extends PartialType(
  OmitType(EventTypeBaseDto, ['id'] as const),
) {}
