import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    description: 'Name of the user',
    type: String,
    nullable: false,
    required: true,
  })
  userName: string;

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
