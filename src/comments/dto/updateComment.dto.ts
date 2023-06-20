import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Comment text',
    type: String,
    nullable: false,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  comment?: string;
}
