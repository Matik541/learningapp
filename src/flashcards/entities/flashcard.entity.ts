import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// entities
import { Lesson } from '../../lessons/entities/lesson.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Flashcard {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  question: string;

  @ApiProperty()
  @Column()
  answer: string;

  @ApiProperty({
    type: () => Lesson,
    example: {
      id: 0,
    },
  })
  @ManyToOne(() => Lesson, (lesson) => lesson.flashcards)
  lesson: Lesson;
}
