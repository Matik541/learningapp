import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

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

  validate(req: Request, data: any) {
    const token = req.get('auth').replace('Bearer', '').trim();

    return { ...data, token };
  }
}
