import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class LessonCompletedDto {
  @ApiProperty({
    description: 'User score',
    type: Number,
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  percent: number;
}
