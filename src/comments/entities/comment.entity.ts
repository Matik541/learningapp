import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// entities
import { User } from '../../users/entities/user.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';

@Entity()
export class Comment {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.comments)
  @JoinTable()
  creator: User;

  @ApiProperty({
    type: () => Lesson,
  })
  @ManyToOne(() => Lesson, (lesson) => lesson.comments)
  lesson: Lesson;

  @ApiProperty()
  @Column()
  comment: string;
}
