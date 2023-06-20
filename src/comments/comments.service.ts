import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from './entities/comment.entity';

import { AddCommentDto } from './dto/addComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getCommentsByLesson(lessonsId: number): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { lesson: { id: lessonsId } },
    });
  }

  async addComment(
    commentCreatorId: number,
    lessonId: number,
    dto: AddCommentDto,
  ): Promise<Comment> {
    // create comment object
    const comment = this.commentRepository.create({
      creator: { id: commentCreatorId },
      lesson: { id: lessonId },
      ...dto,
    });

    try {
      // save comment in db
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

    // change data in comment object
    comment = Object.assign(comment, dto);

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

    try {
      // remove comment from db
      return await this.commentRepository.remove(comment);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async deleteLessonsComments(lessonId: number) {
    const comments = await this.getCommentsByLesson(lessonId);
    console.log(comments);
    return await this.commentRepository.remove(comments);
  }
}
