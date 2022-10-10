import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}
}
