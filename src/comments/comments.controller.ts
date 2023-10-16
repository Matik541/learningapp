import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

// services
import { CommentsService } from './comments.service';

// guards
import { AuthorizationGuard } from '../auth/guards/auth.guard';

// decorators
import { LoginedUserDecorator } from '../auth/decorators/loginedUser.decorator';

// entities
import { Comment } from './entities/comment.entity';

// dtos
import { AddCommentDto } from './dto/addComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

@ApiBearerAuth()
@UseGuards(AuthorizationGuard)
@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('add/:lessonId')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Comment,
    description: 'Add new comment. Then return it.',
  })
  addComment(
    @LoginedUserDecorator('sub') commentCreatorId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body() addCommentDto: AddCommentDto,
  ): Promise<Comment> {
    return this.commentsService.addComment(
      commentCreatorId,
      lessonId,
      addCommentDto,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Comment,
    description: 'Find comment by id. Then update data and return it.',
  })
  updateComment(
    @LoginedUserDecorator('sub') creatorId: number,
    @Param('id', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.updateComment(
      creatorId,
      commentId,
      updateCommentDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Comment,
    description:
      'Find comment by id. Delete it and return data of deleted comment.',
  })
  deleteComment(
    @LoginedUserDecorator('sub') creatorId: number,
    @Param('id', ParseIntPipe) commentId: number,
  ): Promise<Comment> {
    return this.commentsService.deleteComment(creatorId, commentId);
  }
}
