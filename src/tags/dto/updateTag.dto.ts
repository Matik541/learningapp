import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTagDto {
  @ApiProperty({
    description: 'Lesson tag name',
    type: String,
    nullable: false,
    required: false,
  })
  @IsString()
  @IsOptional()
  tagName?: string;
}
