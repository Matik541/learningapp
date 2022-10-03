import { AuthGuard } from '@nestjs/passport';

export class AuthorizationGuard extends AuthGuard('jwt-auth') {
  constructor() {
    super();
  }
}
