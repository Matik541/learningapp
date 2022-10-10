import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// entities
import { User } from 'src/users/entities/user.entity';

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

  // TODO: tags[], flashcards[], comments[]
}
