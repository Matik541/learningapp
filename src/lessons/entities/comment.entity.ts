import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// entities
import { User } from 'src/users/entities/user.entity';
import { Lesson } from './lesson.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinTable()
  creator: User;

  @ManyToOne(() => Lesson, (lesson) => lesson.comments)
  lesson: Lesson;

  @Column()
  comment: string;
}
