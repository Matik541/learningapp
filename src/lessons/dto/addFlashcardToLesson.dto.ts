import { ApiProperty } from '@nestjs/swagger';

export class AddFlashcardToLesson {
  @ApiProperty({
    description: 'Flashcards ids',
    type: [Number],
    nullable: false,
    required: true,
  })
  id: number[];
}
