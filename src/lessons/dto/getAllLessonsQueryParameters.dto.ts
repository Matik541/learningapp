import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetAllLessonsQueryParametersDto {
  @ApiProperty({
    description: 'Tags ids',
    type: [Number],
    required: false,
  })
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @IsOptional()
  tagIds?: number[];

  @ApiProperty({
    description: 'Search parameter',
    type: String,
    required: false,
  })
  @IsOptional()
  searchQuery?: string;
}
