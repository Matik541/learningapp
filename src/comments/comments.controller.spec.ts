import { Test, TestingModule } from '@nestjs/testing';
import { validate } from 'class-validator';

import { CommentsController } from './comments.controller';

import { CommentsService } from './comments.service';
import { mockCommentsService } from './mock/comments.service';

import { AddCommentDto } from './dto/addComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

describe('CommentsController', () => {
  let controller: CommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('add comment route', () => {
    it('should add a comment to lesson', async () => {
      expect(await controller.addComment(1, '1', { comment: 'test' })).toEqual({
        id: expect.any(Number),
        creator: {
          id: 1,
        },
        lesson: {
          id: 1,
        },
        comment: 'test',
      });
    });

    it('should fail validation', async () => {
      const addCommentWithBadData: AddCommentDto = new AddCommentDto();
      addCommentWithBadData.comment = '';

      const err = await validate(addCommentWithBadData);

      expect(err.length).toBe(1);
    });
  });

  describe('update comment route', () => {
    it('should update comment', async () => {
      expect(
        await controller.updateComment(1, '1', { comment: 'updated comment' }),
      ).toEqual({
        id: 1,
        creator: {
          id: 1,
        },
        lesson: {
          id: 1,
        },
        comment: 'updated comment',
      });
    });

    it('should fail validation', async () => {
      const updateCommentWithBadData: UpdateCommentDto = new UpdateCommentDto();
      updateCommentWithBadData.comment = '';

      const err = await validate(updateCommentWithBadData);

      expect(err.length).toBe(1);
    });
  });

  it('should delete comment', async () => {
    expect(await controller.deleteComment(1, '1')).toEqual({
      id: 1,
      creator: {
        id: 1,
      },
      lesson: {
        id: 1,
      },
      comment: 'updated comment',
    });
  });
});
