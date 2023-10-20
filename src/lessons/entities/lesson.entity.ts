import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// entities
import { User } from '../../users/entities/user.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { Flashcard } from '../../flashcards/entities/flashcard.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { LessonCompleted } from './lessonCompleted.entity';

@Entity()
export class Lesson {
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
  @ManyToOne(() => User, (user) => user.createdLessons)
  creator: User;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  iconPath: string;

  @ApiProperty({ type: () => [Tag] })
  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @ApiProperty({
    type: () => [Flashcard],
    example: [
      {
        id: 0,
        question: 'string',
        answer: 'string',
      },
    ],
  })
  @OneToMany(() => Flashcard, (flashcard) => flashcard.lesson)
  flashcards: Flashcard[];

  @ApiProperty({
    type: () => [Comment],
    example: [
      {
        id: 0,
        comment: 'string',
        creator: {
          id: 0,
          userName: 'string',
        },
      },
    ],
  })
  @OneToMany(() => Comment, (comment) => comment.lesson)
  comments: Comment[];

  @ApiProperty({
    type: () => [LessonCompleted],
    example: [
      {
        id: 0,
        score: 0,
      },
    ],
  })
  @OneToMany(() => LessonCompleted, (lessonCompleted) => lessonCompleted.lesson)
  score: LessonCompleted[];
}
