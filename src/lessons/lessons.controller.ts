import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginedUserDecorator } from 'src/auth/decorators/loginedUser.decorator';
import { AuthorizationGuard } from 'src/auth/guards/auth.guard';
import { AddLessonDto } from './dto/addLesson.dto';
import { Lesson } from './entities/lesson.entity';
import { LessonsService } from './lessons.service';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return added lesson data. Get jwt token and payload. ',
  })
  addLesson(
    @LoginedUserDecorator('sub') lessonCreatorId: number,
    @Body() addLessonDto: AddLessonDto,
  ): Promise<Lesson> {
    return this.lessonsService.addLesson(lessonCreatorId, addLessonDto);
  }
}
