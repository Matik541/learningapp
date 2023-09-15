import { Tag } from '../entities/tag.entity';

import { AddTagDto } from '../dto/addTag.dto';
import { UpdateTagDto } from '../dto/updateTag.dto';

const tags: Tag[] = [];

export const mockTagsService = {
  getTags: jest.fn().mockImplementation(async (): Promise<Tag[]> => {
    return Promise.resolve(tags);
  }),
  addTag: jest
    .fn()
    .mockImplementation(async (tagDto: AddTagDto): Promise<Tag> => {
      const tag = new Tag();
      tag.id = tags.length + 1;
      tag.tagName = tagDto.tagName;

      tags.push(tag);

      return Promise.resolve(tag);
    }),
  updateTag: jest
    .fn()
    .mockImplementation(
      async (id: number, updateTagDto: UpdateTagDto): Promise<Tag> => {
        const tag = tags[id - 1];
        tag.tagName = updateTagDto.tagName;

        return Promise.resolve(tag);
      },
    ),
  deleteTag: jest.fn().mockImplementation(async (id: number): Promise<Tag> => {
    const tag = tags[id - 1];
    tags.slice(id - 1, 1);

    return Promise.resolve(tag);
  }),
};
