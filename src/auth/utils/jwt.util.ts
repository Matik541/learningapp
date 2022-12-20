import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWTUtil {
  constructor(private readonly jwtService: JwtService) {}

  decode(tokenWithBarer: string) {
    const token = tokenWithBarer.replace('Bearer ', '');

    return this.jwtService.decode(token, { json: true });
  }
}
