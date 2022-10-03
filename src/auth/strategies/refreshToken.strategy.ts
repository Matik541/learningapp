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
    const token = req.get('auth').replace('Bearer', '').trim();

    return { ...data, token };
  }
}
