import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateLessonDto {
  @ApiProperty({
    description: 'Title of the lesson',
    type: String,
    nullable: false,
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Description of the lesson',
    type: String,
    nullable: false,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Path to the icon in ui',
    type: String,
    nullable: false,
    required: false,
  })
  @IsString()
  @IsOptional()
  iconPath?: string;

  @ApiProperty({
    description: 'Lesson tags',
    type: [Number],
    nullable: false,
    required: false,
  })
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @IsOptional()
  tags?: number[];
}
