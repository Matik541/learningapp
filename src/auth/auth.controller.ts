import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import console from 'console';

// service
import { AuthService } from './auth.service';
import { LoginedUserDecorator } from './decorators/loginedUser.decorator';
import { SignInDto } from './dto/signin.dto';

// dto
import { SignUpDto } from './dto/signup.dto';
import { AuthorizationGuard } from './guards/auth.guard';
import { RefreshGuard } from './guards/refresh.guard';
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
  @UseGuards(AuthorizationGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@LoginedUserDecorator() userData) {
    return this.authService.logout(userData['sub']);
  }

  // refresh token
  @UseGuards(RefreshGuard)
  @Post('refreshtoken')
  @HttpCode(HttpStatus.OK)
  refreshToken(@LoginedUserDecorator() userData) {}
}
