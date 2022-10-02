import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// service
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';

// dto
import { SignUpDto } from './dto/signup.dto';
import { Tokens } from './type/tokens.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //   register
  @Post('register')
  signUp(@Body() signUpDto: SignUpDto): Promise<Tokens> {
    return this.authService.signUp(signUpDto);
  }

  //   login
  @Post('login')
  signIn(@Body() signInDto: SignInDto): Promise<Tokens> {
    return this.authService.signIn(signInDto);
  }
}
