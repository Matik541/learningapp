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
  Headers,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

// decorator
import { LoginedUserDecorator } from 'src/auth/decorators/loginedUser.decorator';

// guard
import { AuthorizationGuard } from 'src/auth/guards/auth.guard';

// dto
import { AddLessonDto } from './dto/addLesson.dto';
import { AddTagDto } from './dto/tag/addTag.dto';
import { GetAllLessonsQueryParametersDto } from './dto/getAllLessonsQueryParameters.dto';
import { UpdateLessonDto } from './dto/updateLesson.dto';
import { AddCommentDto } from './dto/comment/addComment.dto';
import { UpdateCommentDto } from './dto/comment/updateComment.dto';
import { LessonCompletedDto } from './dto/lessonCompleted.dto';

// entity
import { Lesson } from './entities/lesson.entity';
import { Tag } from './entities/tag.entity';
import { Comment } from './entities/comment.entity';
import { LessonCompleted } from './entities/lessonCompleted.entity';

// service
import { LessonsService } from './lessons.service';

// utils
import { JWTUtil } from 'src/auth/utils/jwt.util';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(
    private readonly jwtUtil: JWTUtil,
    private readonly lessonsService: LessonsService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Return all lessons data. Filter them by tags. Query parameters is tags ids',
  })
  async getAllLessons(
    @Headers('Authorization') userToken,
    @Query() query: GetAllLessonsQueryParametersDto,
  ) {
    let userId: number | null = null;

    if (userToken != undefined) {
      // decode jwt token and get id of authorized user
      userId = await this.jwtUtil.decode(userToken).sub;
    }

    return await this.lessonsService.getAllLessons(userId, query);
  }

  @Get('tags')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all tags',
  })
  getLessonTags(): Promise<Tag[]> {
    return this.lessonsService.getTags();
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
    description: 'Return added lesson data. Get jwt token and payload.',
  })
  addLesson(
    @LoginedUserDecorator('sub') lessonCreatorId: number,
    @Body() addLessonDto: AddLessonDto,
  ): Promise<Lesson> {
    return this.lessonsService.addLesson(lessonCreatorId, addLessonDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  @Post('tag/add')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return added tag. Get tag name.',
  })
  addTag(@Body() addTagDto: AddTagDto): Promise<Tag> {
    return this.lessonsService.addTag(addTagDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  @Post('comment/add/:lessonId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return added tag. Get tag name.',
  })
  addComment(
    @LoginedUserDecorator('sub') commentCreatorId: number,
    @Param('lessonId') lessonId: string,
    @Body() addCommentDto: AddCommentDto,
  ): Promise<Comment> {
    return this.lessonsService.addComment(
      commentCreatorId,
      +lessonId,
      addCommentDto,
    );
  }

  @ApiBearerAuth()
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

  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  @Put('comment/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update and return comment data by id.',
  })
  updateComment(
    @LoginedUserDecorator('sub') creatorId: number,
    @Param('id') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.lessonsService.updateComment(
      creatorId,
      +commentId,
      updateCommentDto,
    );
  }

  @ApiBearerAuth()
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

  @ApiBearerAuth()
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

  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  @Delete('comment/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete and return comment data by id.',
  })
  deleteComment(
    @LoginedUserDecorator('sub') creatorId: number,
    @Param('id') commentId: string,
  ): Promise<Comment> {
    return this.lessonsService.deleteComment(creatorId, +commentId);
  }
}
