import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

// dto
import { AddTagToLesson } from '../../tags/dto/addTagToLesson.dto';

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

  @ApiProperty({
    description: 'Path to the icon in ui',
    type: String,
    nullable: false,
    required: false,
  })
  @IsString()
  @IsOptional()
  iconPath?: string;

  @ApiProperty({
    description: 'Lesson tags',
    type: [AddTagToLesson],
    nullable: false,
    required: false,
  })
  @IsArray()
  @IsOptional()
  tags?: AddTagToLesson[];
}
