import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  //   TODO: add lessonsCompleted, lessonsCreated, createdComments
}
