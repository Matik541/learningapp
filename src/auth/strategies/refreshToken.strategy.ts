import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayloadType } from '../type/tokenPayload.type';

export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'refresh-secret',
      passReqToCallback: true,
    });
  }

  validate(req: Request, data: TokenPayloadType) {
    let refreshT: string;

    if (req) {
      refreshT = req.get('authorization').replace('Bearer', '').trim();
    }

    return { ...data, refreshT };
  }
}
