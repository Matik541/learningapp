import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// entities
import { Lesson } from './lesson.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class LessonCompleted {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.lessonsCompleted)
  user: User;

  @ManyToOne(() => Lesson, (lesson) => lesson.score)
  lesson: Lesson;

  @Column()
  score: number;
}
