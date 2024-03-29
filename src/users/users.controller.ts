import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

// decorators
import { LoginedUserDecorator } from '../auth/decorators/loginedUser.decorator';

// guards
import { AuthorizationGuard } from '../auth/guards/auth.guard';

// entities
import { User } from './entities/user.entity';

// service
import { UsersService } from './users.service';

// dto
import { GetMeDto } from './dto/getMe.dto';
import { GetUserDto } from './dto/getUser.dto';

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
    type: GetMeDto,
    description: 'Return data of logged user.',
  })
  getMe(@LoginedUserDecorator('sub') userId: number): Promise<User> {
    return this.usersService.getMe(userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUserDto,
    description: 'Return user data by id.',
  })
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.getUserById(id);
  }
}
