import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Put,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';

// services
import { TagsService } from './tags.service';

// entities
import { Tag } from './entities/tag.entity';

// guards
import { AuthorizationGuard } from '../auth/guards/auth.guard';

// dto
import { AddTagDto } from './dto/addTag.dto';
import { UpdateTagDto } from './dto/updateTag.dto';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: [Tag],
    description: 'Return all tags.',
  })
  getLessonTags(): Promise<Tag[]> {
    return this.tagsService.getTags();
  }

  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Tag,
    description: 'Add and return new tag.',
  })
  addTag(@Body() addTagDto: AddTagDto): Promise<Tag> {
    return this.tagsService.addTag(addTagDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Tag,
    description: 'Update and return tag data.',
  })
  updateTag(
    @Param('id', ParseIntPipe) tagId: number,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<Tag> {
    return this.tagsService.updateTag(tagId, updateTagDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Tag,
    description: 'Delete and return comment tag by id.',
  })
  deleteTag(@Param('id', ParseIntPipe) tagId: number): Promise<Tag> {
    return this.tagsService.deleteTag(tagId);
  }
}
