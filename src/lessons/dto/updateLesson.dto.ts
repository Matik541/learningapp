import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateLessonDto {
  @ApiProperty({
    description: 'Title of the lesson',
    type: String,
    nullable: false,
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Description of the lesson',
    type: String,
    nullable: false,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
