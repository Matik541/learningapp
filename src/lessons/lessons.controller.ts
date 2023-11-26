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
  ParseIntPipe,
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
    type: [Lesson],
    description:
      'Return all lessons data. <br> Filter them by searchQuery and tags. <br> If user logged return scores.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          'each value in tagIds must be a number conforming to the specified constraints',
        ],
        error: 'Bad Request',
      },
    },
    description: 'Validation error.',
  })
  getAllLessons(
    @Query() query: GetAllLessonsQueryParametersDto,
    @LoginedUserDecorator('sub') userId: number,
  ): Promise<Lesson[]> {
    return this.lessonsService.getAllLessons(userId, query);
  }

  @UseGuards(OptionalAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Lesson,
    description: 'Return lesson data by id. <br> If user logged return scores.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Could not find lesson with id: 0.`,
        error: 'Not Found',
      },
    },
  })
  getLessonById(
    @Param('id') id: string,
    @LoginedUserDecorator('sub') userId: number,
  ): Promise<Lesson> {
    return this.lessonsService.getLessonById(+id, userId);
  }

  @UseGuards(AuthorizationGuard)
  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Lesson,
    description: 'Add lesson and return data.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          'title should not be empty',
          'description should not be empty',
          'iconPath should not be empty',
        ],
        error: 'Bad Request',
      },
    },
    description: 'Validation error.',
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
    type: Lesson,
    description: 'Update and return lesson data by id.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    schema: {
      example: { statusCode: HttpStatus.UNAUTHORIZED, message: 'Unauthorized' },
    },
    description: 'User not authorized.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    schema: {
      example: {
        error: 'Forbidden',
        message: 'Access denied.',
        statusCode: HttpStatus.FORBIDDEN,
      },
    },
    description: 'User are not author of the lesson.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Could not find lesson with id: 0.`,
        error: 'Not Found',
      },
    },
    description: 'Could not find lesson.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          'iconPath must be a string',
          'each value in tags must be a number conforming to the specified constraints',
        ],
        error: 'Bad Request',
      },
    },
    description: 'Validation error.',
  })
  updateLesson(
    @LoginedUserDecorator('sub') creatorId: number,
    @Param('id', ParseIntPipe) lessonId: number,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson> {
    return this.lessonsService.updateLesson(
      creatorId,
      lessonId,
      updateLessonDto,
    );
  }

  @UseGuards(AuthorizationGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Lesson,
    description: 'Delete and return lesson data by id.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    schema: {
      example: {
        error: 'Forbidden',
        message: 'Access denied.',
        statusCode: HttpStatus.FORBIDDEN,
      },
    },
    description: 'User are not author of the lesson.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Could not find lesson with id: 0.`,
        error: 'Not Found',
      },
    },
    description: 'Could not find lesson.',
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
    type: LessonCompleted,
    description: 'Save user score.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Could not find lesson with id: 0.`,
        error: 'Not Found',
      },
    },
    description: 'Could not find lesson.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          'percent must not be greater than 100',
          'percent must not be less than 0',
          'percent must be a number conforming to the specified constraints',
        ],
        error: 'Bad Request',
      },
    },
    description: 'Validation error.',
  })
  lessonCompleted(
    @LoginedUserDecorator('sub') userId: number,
    @Param('id', ParseIntPipe) lessonId: number,
    @Body() dto: LessonCompletedDto,
  ): Promise<LessonCompleted> {
    return this.lessonsService.lessonCompleted(userId, lessonId, dto);
  }
}
