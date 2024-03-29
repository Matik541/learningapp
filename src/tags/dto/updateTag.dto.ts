import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTagDto {
  @ApiProperty({
    description: 'Lesson tag name',
    type: String,
    nullable: false,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tagName?: string;
}
