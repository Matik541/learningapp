import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

// entities
import { Tag } from '../entities/tag.entity';
import { AddTagDto } from './addTag.dto';

export class AddLessonDto {
  @ApiProperty({
    description: 'Title of the lesson',
    type: String,
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of the lesson',
    type: String,
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Lesson tags',
    type: [AddTagDto],
    nullable: false,
    required: true,
  })
  tags: Tag[];
}
