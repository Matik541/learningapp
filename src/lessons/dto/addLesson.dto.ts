import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

// dto
import { AddFlashcardDto } from '../../flashcards/dto/addFlashcard.dto';

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
    description: 'Path to the icon in ui',
    type: String,
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  iconPath: string;

  @ApiProperty({
    description: "Id's of lesson tags",
    type: [Number],
    nullable: false,
    required: true,
  })
  @Type(() => Number)
  @IsNumber({}, { each: true })
  tags: number[];

  @ApiProperty({
    description: 'Lesson flashcards',
    type: [AddFlashcardDto],
    nullable: false,
    required: true,
  })
  @IsArray()
  flashcards: AddFlashcardDto[];
}
