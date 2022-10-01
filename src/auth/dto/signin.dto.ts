import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    description: 'Email of the user',
    type: String,
    nullable: false,
    required: true,
  })
  @ApiProperty()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    type: String,
    nullable: false,
    required: true,
  })
  hashedPassword: string;
}
