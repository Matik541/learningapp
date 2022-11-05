import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// entities
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.comments)
  creator: User;

  @Column()
  comment: string;
}
