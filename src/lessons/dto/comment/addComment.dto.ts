import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCommentDto {
  @ApiProperty({
    description: 'Comment text',
    type: String,
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;
}
