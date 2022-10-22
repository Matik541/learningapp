import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddFlashcard {
  @ApiProperty({
    description: 'World on polish',
    type: String,
    nullable: false,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  world: string;

  @ApiProperty({
    description: 'Translation of the world on polish',
    type: String,
    nullable: false,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  translation: string;
}
