import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

// decorator
import { LoginedUserDecorator } from '../auth/decorators/loginedUser.decorator';

// guard
import { AuthorizationGuard } from '../auth/guards/auth.guard';
import { OptionalAuthGuard } from '../auth/guards/optionalAuth.guard';

// dto
import { AddLessonDto } from './dto/addLesson.dto';
import { GetAllLessonsQueryParametersDto } from './dto/getAllLessonsQueryParameters.dto';
import { UpdateLessonDto } from './dto/updateLesson.dto';
import { LessonCompletedDto } from './dto/lessonCompleted.dto';

// entity
import { Lesson } from './entities/lesson.entity';
import { LessonCompleted } from './entities/lessonCompleted.entity';

// service
import { LessonsService } from './lessons.service';

@ApiBearerAuth()
@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @UseGuards(OptionalAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Return all lessons data. Filter them by tags. Query parameters is tags ids',
  })
  getAllLessons(
    @Query() query: GetAllLessonsQueryParametersDto,
    @LoginedUserDecorator() userId: number = null,
  ) {
    return this.lessonsService.getAllLessons(userId, query);
  }

  @UseGuards(OptionalAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return lesson data by id.',
  })
  getLessonById(
    @Param('id') id: string,
    @LoginedUserDecorator('sub') userId: number = null,
  ): Promise<Lesson> {
    return this.lessonsService.getLessonById(+id, userId);
  }

  @UseGuards(AuthorizationGuard)
  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return added lesson data. Get jwt token and payload.',
  })
  addLesson(
    @LoginedUserDecorator('sub') lessonCreatorId: number,
    @Body() addLessonDto: AddLessonDto,
  ): Promise<Lesson> {
    return this.lessonsService.addLesson(lessonCreatorId, addLessonDto);
  }

  @UseGuards(AuthorizationGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update and return lesson data by id.',
  })
  updateLesson(
    @LoginedUserDecorator('sub') creatorId: number,
    @Param('id') lessonId: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson> {
    return this.lessonsService.updateLesson(
      creatorId,
      +lessonId,
      updateLessonDto,
    );
  }

  @UseGuards(AuthorizationGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete and return lesson data by id.',
  })
  deleteLesson(
    @LoginedUserDecorator('sub') creatorId: number,
    @Param('id') lessonId: string,
  ): Promise<Lesson> {
    return this.lessonsService.deleteLesson(creatorId, +lessonId);
  }

  @UseGuards(AuthorizationGuard)
  @Post('completed/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Save user score.',
  })
  lessonCompleted(
    @LoginedUserDecorator('sub') userId: number,
    @Param('id') lessonId: string,
    @Body() dto: LessonCompletedDto,
  ): Promise<LessonCompleted> {
    return this.lessonsService.lessonCompleted(userId, +lessonId, dto);
  }
}
