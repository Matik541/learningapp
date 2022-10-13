import { ApiProperty } from '@nestjs/swagger';

export class UpdateLessonDto {
  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  description?: string;
}
