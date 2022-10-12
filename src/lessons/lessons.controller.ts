import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

// decorator
import { LoginedUserDecorator } from 'src/auth/decorators/loginedUser.decorator';

// guard
import { AuthorizationGuard } from 'src/auth/guards/auth.guard';

// dto
import { AddLessonDto } from './dto/addLesson.dto';

// entity
import { Lesson } from './entities/lesson.entity';

// service
import { LessonsService } from './lessons.service';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all lessons data.',
  })
  getAllLessons(): Promise<Lesson[]> {
    return this.lessonsService.getAllLessons();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return lesson data by id.',
  })
  getLessonById(@Param('id') id: string): Promise<Lesson> {
    return this.lessonsService.getLessonById(+id);
  }

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
