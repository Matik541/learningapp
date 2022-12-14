import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateFlashcard {
  @ApiProperty({
    description: 'Flashcard id',
    type: Number,
    nullable: false,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

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
