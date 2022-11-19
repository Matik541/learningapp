import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// entities
import { User } from 'src/users/entities/user.entity';
import { Lesson } from './lesson.entity';

@Entity()
export class LessonCompleted {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.lessonCompleted)
  user: User;

  @ManyToOne(() => Lesson, (lesson) => lesson.scores)
  lesson: Lesson;

  @Column()
  score: number;
}
