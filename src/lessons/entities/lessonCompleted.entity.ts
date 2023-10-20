import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// entities
import { Lesson } from './lesson.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class LessonCompleted {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: () => User,
    example: {
      id: 0,
      userName: 'string',
    },
  })
  @ManyToOne(() => User, (user) => user.lessonsCompleted)
  user: User;

  @ApiProperty({
    type: () => Lesson,
    example: {
      id: 0,
    },
  })
  @ManyToOne(() => Lesson, (lesson) => lesson.score)
  lesson: Lesson;

  @ApiProperty()
  @Column()
  score: number;
}
