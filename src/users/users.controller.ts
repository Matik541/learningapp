import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

// decorators
import { LoginedUserDecorator } from 'src/auth/decorators/loginedUser.decorator';

// guards
import { AuthorizationGuard } from 'src/auth/guards/auth.guard';

// entities
import { User } from './entities/user.entity';

// service
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return data of logged user',
  })
  async getMe(@LoginedUserDecorator('sub') userId: number): Promise<User> {
    return await this.usersService.getUserById(userId);
  }
}
