import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    type: String,
    nullable: false,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  comment: string;
}
