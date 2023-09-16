import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CommentsService } from './comments.service';

import { AuthorizationGuard } from '../auth/guards/auth.guard';

import { LoginedUserDecorator } from '../auth/decorators/loginedUser.decorator';

import { Comment } from './entities/comment.entity';

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
    description: 'Return added comment.',
  })
  addComment(
    @LoginedUserDecorator('sub') commentCreatorId: number,
    @Param('lessonId') lessonId: string,
    @Body() addCommentDto: AddCommentDto,
  ): Promise<Comment> {
    return this.commentsService.addComment(
      commentCreatorId,
      +lessonId,
      addCommentDto,
    );
  }

  @Put(':id')
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
    return this.commentsService.updateComment(
      creatorId,
      +commentId,
      updateCommentDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete and return comment data by id.',
  })
  deleteComment(
    @LoginedUserDecorator('sub') creatorId: number,
    @Param('id') commentId: string,
  ): Promise<Comment> {
    return this.commentsService.deleteComment(creatorId, +commentId);
  }
}
