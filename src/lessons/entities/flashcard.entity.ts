import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// entities
import { Lesson } from './lesson.entity';

@Entity()
export class Flashcard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  world: string;

  @Column()
  translation: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.flashcards)
  lesson: Lesson;
}
