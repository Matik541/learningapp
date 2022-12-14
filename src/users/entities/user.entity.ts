import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// entities
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Comment } from 'src/lessons/entities/comment.entity';
import { LessonCompleted } from 'src/lessons/entities/lessonCompleted.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  hashedPassword: string;

  @Column({ nullable: true })
  hashedRefreshToken?: string;

  @OneToMany(() => Lesson, (lesson) => lesson.creator)
  createdLessons: Lesson[];

  @OneToMany(() => Comment, (comment) => comment.creator)
  comments: Comment[];

  @OneToMany(() => LessonCompleted, (lessonCompleted) => lessonCompleted.user)
  lessonsCompleted: LessonCompleted[];
}
