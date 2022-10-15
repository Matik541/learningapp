import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddTagDto {
  @ApiProperty({
    description: 'Tag id',
    type: Number,
    nullable: false,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

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
