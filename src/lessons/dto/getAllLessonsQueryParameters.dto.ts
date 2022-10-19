import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetAllLessonsQueryParametersDto {
  @ApiProperty({
    description: 'Tags ids',
    type: [Number],
    required: false,
  })
  @IsNotEmpty()
  @IsOptional()
  tagIds: number[];
}
