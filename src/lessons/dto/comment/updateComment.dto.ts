import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Comment id',
    type: Number,
    nullable: false,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

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
