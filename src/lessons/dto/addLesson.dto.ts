import { ApiProperty } from '@nestjs/swagger';

export class AddLessonDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
