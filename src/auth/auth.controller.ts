import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// service
import { AuthService } from './auth.service';

// dto
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

// decorator
import { LoginedUserDecorator } from './decorators/loginedUser.decorator';

// guard
import { AuthorizationGuard } from './guards/auth.guard';
import { RefreshGuard } from './guards/refresh.guard';

// type
import { Tokens } from './type/tokens.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //   register
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() signUpDto: SignUpDto): Promise<Tokens> {
    return this.authService.signUp(signUpDto);
  }

  //   login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: SignInDto): Promise<Tokens> {
    return this.authService.signIn(signInDto);
  }

  // logout
  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@LoginedUserDecorator('sub') id: number): Promise<void> {
    return this.authService.logout(id);
  }

  // refresh token
  @ApiBearerAuth()
  @UseGuards(RefreshGuard)
  @Post('refreshtoken')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @LoginedUserDecorator('sub') id: number,
    @LoginedUserDecorator('refreshT') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshToken(id, refreshToken);
  }
}
