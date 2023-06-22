import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFlashcardDto {
  @ApiProperty({
    type: String,
    nullable: false,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  question?: string;

  @ApiProperty({
    type: String,
    nullable: false,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  answer?: string;
}
