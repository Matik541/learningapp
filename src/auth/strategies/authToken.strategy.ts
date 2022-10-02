import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AuthTokenStrategy extends PassportStrategy(Strategy, 'jwt-auth') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'auth-secret',
    });
  }

  validate(data: any) {
    return data;
  }
}
