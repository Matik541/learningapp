import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';

import { Comment } from './entities/comment.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { User } from 'src/users/entities/user.entity';

import { AddCommentDto } from './dto/addComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private eventEmitter: EventEmitter2,
    private readonly logger: Logger,
  ) {}

  // TODO: add methods documentation

  async addComment(
    commentCreatorId: number,
    lessonId: number,
    dto: AddCommentDto,
  ): Promise<Comment> {
    const user: User = (
      await this.eventEmitter.emitAsync('users.get_by_id', commentCreatorId)
    )[0];

    const lesson: Lesson = (
      await this.eventEmitter.emitAsync('lessons.get_lesson_by_id', lessonId)
    )[0];

    if (lesson === undefined) {
      throw new NotFoundException(
        `Could not find lesson with id: ${lessonId}.`,
      );
    }

    // create comment object
    const comment = this.commentRepository.create({
      creator: { id: user.id },
      lesson: { id: lesson.id },
      ...dto,
    });

    // save comment in db
    try {
      return await this.commentRepository.save(comment);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async updateComment(
    creatorId: number,
    commentId: number,
    dto: UpdateCommentDto,
  ): Promise<Comment> {
    // get comment by id
    let comment = await this.commentRepository.findOneOrFail({
      select: {
        id: true,
        comment: true,
        creator: {
          id: true,
          userName: true,
        },
      },
      where: { id: commentId },
      relations: {
        creator: true,
      },
    });

    // check is comment author
    if (comment.creator.id !== creatorId) {
      throw new BadRequestException('You are not allowed to update.');
    }

    // update data in comment object
    comment = {
      id: comment.id,
      creator: comment.creator,
      lesson: comment.lesson,
      comment: dto.comment,
    };

    // save updated comment
    try {
      return await this.commentRepository.save(comment);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async deleteComment(creatorId: number, commentId: number): Promise<Comment> {
    // get comment by id
    const comment = await this.commentRepository.findOneOrFail({
      select: {
        id: true,
        comment: true,
        creator: {
          id: true,
          userName: true,
        },
      },
      where: { id: commentId },
      relations: {
        creator: true,
      },
    });

    // check is comment author
    if (comment.creator.id !== creatorId) {
      throw new BadRequestException('You are not allowed to update.');
    }

    // remove comment from db
    try {
      return await this.commentRepository.remove(comment);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @OnEvent('comments.delete_all')
  private async deleteLessonsComments(
    lessonId: number,
    lessonCreatorId: number,
  ): Promise<Comment[]> {
    const comments = await this.getCommentsByLesson(lessonId, lessonCreatorId);

    try {
      return await this.commentRepository.remove(comments);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  private async getCommentsByLesson(
    lessonsId: number,
    lessonCreatorId: number,
  ): Promise<Comment[]> {
    try {
      return await this.commentRepository.find({
        where: { lesson: { id: lessonsId, creator: { id: lessonCreatorId } } },
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
