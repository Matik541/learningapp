import { AuthGuard } from '@nestjs/passport';

export class OptionalAuthGuard extends AuthGuard('jwt-auth') {
  handleRequest(err, user, info, context) {
    return user;
  }
}
