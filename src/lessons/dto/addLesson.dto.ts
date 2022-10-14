import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddLessonDto {
  @ApiProperty({
    description: 'Title of the lesson',
    type: String,
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of the lesson',
    type: String,
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
