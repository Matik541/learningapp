import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

// dto
import { AddTagToLesson } from './tag/addTagToLesson.dto';
import { AddFlashcardDto } from './flashcard/addFlashcard.dto';

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
    type: [AddTagToLesson],
    nullable: false,
    required: true,
  })
  @IsArray()
  tags: AddTagToLesson[];

  @ApiProperty({
    description: 'Lesson flashcards',
    type: [AddFlashcardDto],
    nullable: false,
    required: true,
  })
  @IsArray()
  flashcards: AddFlashcardDto[];
}
