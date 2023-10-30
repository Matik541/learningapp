import { Test, TestingModule } from '@nestjs/testing';
import { validate } from 'class-validator';

import { TagsController } from './tags.controller';

import { TagsService } from './tags.service';
import { mockTagsService } from './mock/tags.service';

import { Tag } from './entities/tag.entity';

import { AddTagDto } from './dto/addTag.dto';
import { UpdateTagDto } from './dto/updateTag.dto';

describe('TagsController', () => {
  let controller: TagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        {
          provide: TagsService,
          useValue: mockTagsService,
        },
      ],
    }).compile();

    controller = module.get<TagsController>(TagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all tags', async () => {
    expect(await controller.getLessonTags()).toBeInstanceOf(Array<Tag>);
    expect(mockTagsService.getTags).toHaveBeenCalled();
  });

  describe('add tag', () => {
    it('should add tag', async () => {
      expect(await controller.addTag({ tagName: 'testTag' })).toEqual({
        id: expect.any(Number),
        tagName: 'testTag',
      });
    });

    it('should fail validation', async () => {
      const addTagWithBadData: AddTagDto = new AddTagDto();
      addTagWithBadData.tagName = '';

      const err = await validate(addTagWithBadData);

      expect(err.length).toBe(1);
    });
  });

  describe('update tags', () => {
    it('should update tag', async () => {
      expect(await controller.updateTag(1, { tagName: 'updated tag' })).toEqual(
        {
          id: 1,
          tagName: 'updated tag',
        },
      );
    });

    it('should fail validation', async () => {
      const updatedTagWithBadData: UpdateTagDto = new UpdateTagDto();
      updatedTagWithBadData.tagName = '';

      const err = await validate(updatedTagWithBadData);

      expect(err.length).toBe(1);
    });
  });

  it('should delete tag', async () => {
    expect(await controller.deleteTag(1)).toEqual({
      id: 1,
      tagName: 'updated tag',
    });
  });
});
