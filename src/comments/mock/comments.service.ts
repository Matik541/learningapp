import { BadRequestException } from '@nestjs/common';

import { User } from 'src/users/entities/user.entity';
import { Comment } from '../entities/comment.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';

import { AddCommentDto } from '../dto/addComment.dto';

import { UpdateCommentDto } from '../dto/updateComment.dto';

let comments: Comment[] = [];

const mockUser: User = new User();
const mockLesson: Lesson = new Lesson();

export const mockCommentsService = {
  addComment: jest
    .fn()
    .mockImplementation(
      async (
        commentCreatorId: number,
        lessonId: number,
        dto: AddCommentDto,
      ): Promise<Comment> => {
        const comment: Comment = new Comment();

        mockUser.id = commentCreatorId;
        mockLesson.id = lessonId;

        comment.id = comments.length + 1;
        comment.creator = mockUser;
        comment.lesson = mockLesson;
        comment.comment = dto.comment;

        comments.push(comment);

        return Promise.resolve(comment);
      },
    ),
  updateComment: jest
    .fn()
    .mockImplementation(
      async (
        creatorId: number,
        commentId: number,
        dto: UpdateCommentDto,
      ): Promise<Comment> => {
        const comment: Comment = comments[commentId - 1];

        if (comment.creator.id !== creatorId) {
          throw new BadRequestException('You are not allowed to update.');
        }

        comment.comment = dto.comment;

        return Promise.resolve(comment);
      },
    ),
  deleteComment: jest
    .fn()
    .mockImplementation(
      async (creatorId: number, commentId: number): Promise<Comment> => {
        const comment = comments[commentId - 1];

        if (comment.creator.id !== creatorId) {
          throw new BadRequestException('You are not allowed to update.');
        }

        comments = comments.slice(commentId - 1, 1);

        return Promise.resolve(comment);
      },
    ),
};
