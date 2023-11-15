import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { In, Repository } from 'typeorm';

// entities
import { Tag } from './entities/tag.entity';

// dto
import { AddTagDto } from './dto/addTag.dto';
import { UpdateTagDto } from './dto/updateTag.dto';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {}

  /**
   * It returns a promise of an array of Tag objects.
   * @returns An array of Tag objects.
   */
  async getTags(): Promise<Tag[]> {
    // find and return all tags
    try {
      return await this.tagRepository.find();
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @OnEvent('tags.get_tags_by_ids')
  private async getTagsByIds(tagIds: number[]): Promise<Tag[]> {
    try {
      return await this.tagRepository.find({
        where: { id: In(tagIds) },
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * It creates a new tag object and them in the database.
   * @param {AddTagDto} addTagDto - AddTagDto - this is the DTO that we created earlier.
   * @returns The tag object that was created and saved to the db.
   */
  async addTag(addTagDto: AddTagDto): Promise<Tag> {
    // create tag object
    const tag = this.tagRepository.create(addTagDto);

    try {
      // save tag in db
      return await this.tagRepository.save(tag);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * Updates a tag's data in the database based on the provided ID and UpdateTagDto.
   * @param {number} id - The id parameter is a number that represents the unique identifier of the tag
   * that needs to be updated.
   * @param {UpdateTagDto} updateTagDto - UpdateTagDto is a data transfer object that contains the
   * updated information for a tag. It may have a property called "tagName" which represents the new
   * name of the tag.
   * @returns This function is returning a Promise that resolves to a Tag object.
   */
  async updateTag(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    try {
      // find tag by id
      let tag = await this.tagRepository.findOneByOrFail({ id });

      // change tag's data
      if (updateTagDto.tagName !== null)
        tag = { id: tag.id, tagName: updateTagDto.tagName };

      // save in the db
      return await this.tagRepository.save(tag);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * Deletes a tag from the database by its ID.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of the
   * tag that needs to be deleted from the database.
   * @returns This function is returning a Promise that resolves to a Tag object after deleting a tag
   * from the database.
   */
  async deleteTag(id: number): Promise<Tag> {
    try {
      // find tag by id
      const tag = await this.tagRepository.findOneByOrFail({ id });

      // remove tag from db
      return await this.tagRepository.remove(tag);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
