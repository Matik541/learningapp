import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// entities
import { Lesson } from 'src/lessons/entities/lesson.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'hashed_password' })
  hashedPassword: string;

  @Column({ name: 'hashed_refresh_token', nullable: true })
  hashedRefreshToken?: string;

  @OneToMany(() => Lesson, (lesson) => lesson.creator)
  createdLessons: Lesson[];

  //   TODO: add lessonsCompleted, createdComments
}