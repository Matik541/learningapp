import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const LoginedUserDecorator = createParamDecorator(
  (data: undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    return req.user;
  },
);
