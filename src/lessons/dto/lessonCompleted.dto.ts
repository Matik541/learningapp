import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class LessonCompletedDto {
  @ApiProperty({
    description: 'User score',
    type: Number,
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  percent: number;
}
