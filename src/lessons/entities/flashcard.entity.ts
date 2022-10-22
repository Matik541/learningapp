import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Flashcard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  world: string;

  @Column()
  translation: string;
}
