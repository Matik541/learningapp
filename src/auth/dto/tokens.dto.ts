import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
  @ApiProperty()
  authToken: string;

  @ApiProperty()
  refreshToken: string;
}
