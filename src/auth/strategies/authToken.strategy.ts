import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayloadType } from '../type/tokenPayload.type';

@Injectable()
export class AuthTokenStrategy extends PassportStrategy(Strategy, 'jwt-auth') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'auth-secret',
    });
  }

  validate(data: TokenPayloadType) {
    return data;
  }
}
