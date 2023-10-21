import { ApiProperty } from '@nestjs/swagger';

// entities
import { Lesson } from '../../lessons/entities/lesson.entity';
import { Comment } from '../../comments/entities/comment.entity';

export class GetUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({
    type: () => [Lesson],
    example: [
      {
        id: 0,
        title: 'string',
        description: 'string',
        iconPath: 'string',
      },
    ],
  })
  createdLessons: Lesson[];

  @ApiProperty({
    type: () => [Comment],
    example: [
      {
        id: 0,
        comment: 'string',
      },
    ],
  })
  comments: Comment[];
}
