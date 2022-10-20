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

  @ApiProperty({
    description: 'Search parameter',
    type: String,
    required: false,
  })
  searchQuery: string;
}
