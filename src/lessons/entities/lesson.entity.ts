import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// entities
import { User } from 'src/users/entities/user.entity';
import { Tag } from './tag.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.createdLessons)
  @JoinTable()
  creator: User;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  // TODO: flashcards[], comments[]
}
