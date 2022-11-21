import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// entities
import { User } from 'src/users/entities/user.entity';
import { Tag } from './tag.entity';
import { Flashcard } from './flashcard.entity';
import { Comment } from './comment.entity';
import { LessonCompleted } from './lessonCompleted.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.createdLessons)
  creator: User;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  iconPath: string;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Flashcard, (flashcard) => flashcard.lesson)
  flashcards: Flashcard[];

  @OneToMany(() => Comment, (comment) => comment.lesson)
  comments: Comment[];

  @OneToMany(() => LessonCompleted, (lessonCompleted) => lessonCompleted.lesson)
  score: number;
}
