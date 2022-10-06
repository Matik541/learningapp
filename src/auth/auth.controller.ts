import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Return access and refresh tokens. Create a new user and save them in the database.',
  })
  signUp(@Body() signUpDto: SignUpDto): Promise<Tokens> {
    return this.authService.signUp(signUpDto);
  }

  //   login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Return access and refresh tokens. Save refresh token in database.',
  })
  signIn(@Body() signInDto: SignInDto): Promise<Tokens> {
    return this.authService.signIn(signInDto);
  }

  // logout
  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return nothing. Remove refresh token from db.',
  })
  logout(@LoginedUserDecorator('sub') id: number): Promise<void> {
    return this.authService.logout(id);
  }

  // refresh token
  @ApiBearerAuth()
  @UseGuards(RefreshGuard)
  @Post('refreshtoken')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Return new access and refresh tokens. And update the refresh token in the database.',
  })
  refreshToken(
    @LoginedUserDecorator('sub') id: number,
    @LoginedUserDecorator('refreshT') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshToken(id, refreshToken);
  }
}
