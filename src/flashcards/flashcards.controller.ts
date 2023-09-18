import {
  Controller,
  Post,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Param,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FlashcardsService } from './flashcards.service';

import { AuthorizationGuard } from '../auth/guards/auth.guard';

import { Flashcard } from './entities/flashcard.entity';

import { LoginedUserDecorator } from '../auth/decorators/loginedUser.decorator';

import { AddFlashcardDto } from './dto/addFlashcard.dto';
import { UpdateFlashcardDto } from './dto/updateFlashcard.dto';

@ApiTags('flashcards')
@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @ApiBearerAuth()
  @ApiBody({ type: [AddFlashcardDto] })
  @UseGuards(AuthorizationGuard)
  @Post(':lessonId')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Add a flashcards to lesson.',
  })
  addFlashcardsToLesson(
    @LoginedUserDecorator('sub') lessonCreatorId: number,
    @Param('lessonId') lessonId: string,
    @Body() addFlashcardsDto: AddFlashcardDto[],
  ) {
    return this.flashcardsService.addFlashcardsToLesson(
      lessonCreatorId,
      +lessonId,
      addFlashcardsDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  @Put(':lessonId/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update flashcards in lesson.',
  })
  updateFlashcard(
    @LoginedUserDecorator('sub') lessonCreatorId: number,
    @Param('lessonId') lessonId: string,
    @Param('id') flashcardId: string,
    @Body() updateFlashcardsDto: UpdateFlashcardDto,
  ): Promise<Flashcard> {
    return this.flashcardsService.updateFlashcard(
      lessonCreatorId,
      +lessonId,
      +flashcardId,
      updateFlashcardsDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  @Delete(':lessonId/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete flashcard by id.',
  })
  removeFlashcard(
    @LoginedUserDecorator('sub') lessonCreatorId: number,
    @Param('lessonId') lessonId: string,
    @Param('id') flashcardId: string,
  ): Promise<Flashcard> {
    return this.flashcardsService.removeFlashcard(
      lessonCreatorId,
      +lessonId,
      +flashcardId,
    );
  }
}
