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
import { TokensDto } from './dto/tokens.dto';

// decorator
import { LoginedUserDecorator } from './decorators/loginedUser.decorator';

// guard
import { AuthorizationGuard } from './guards/auth.guard';
import { RefreshGuard } from './guards/refresh.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: TokensDto,
    description:
      'Create a new user and save them in the database. <br> Return access and refresh tokens. <br> Auth token responsible for access to routes. Expire in 5 min. <br> Refresh token responsible for getting the new token. Expire in 1 day.',
  })
  signUp(@Body() signUpDto: SignUpDto): Promise<TokensDto> {
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: TokensDto,
    description:
      'Save refresh token in database. <br> Return access and refresh tokens. <br> Auth token responsible for access to routes. Expire in 5 min. <br> Refresh token responsible for getting the new token. Expire in 1 day.',
  })
  signIn(@Body() signInDto: SignInDto): Promise<TokensDto> {
    return this.authService.signIn(signInDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Remove user refresh token from db, what disable opportunity to refresh tokens.',
  })
  logout(@LoginedUserDecorator('sub') id: number): Promise<void> {
    return this.authService.logout(id);
  }

  @ApiBearerAuth()
  @UseGuards(RefreshGuard)
  @Post('refreshtoken')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: TokensDto,
    description:
      'Return new tokens. And update users refresh token in the database. <br> Auth token responsible for access to routes. Expire in 5 min. <br> Refresh token responsible for getting the new token. Expire in 1 day.',
  })
  refreshToken(
    @LoginedUserDecorator('sub') id: number,
    @LoginedUserDecorator('refreshT') refreshToken: string,
  ): Promise<TokensDto> {
    return this.authService.refreshToken(id, refreshToken);
  }
}
