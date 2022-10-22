import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

// dto
import { AddTagToLesson } from './addTagToLesson.dto';
import { AddFlashcardToLesson } from './addFlashcardToLesson.dto';
import { AddFlashcard } from './addFlashcard.dto';

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
    type: [AddFlashcard],
    nullable: false,
    required: true,
  })
  @IsArray()
  flashcards: AddFlashcardToLesson[];
}
