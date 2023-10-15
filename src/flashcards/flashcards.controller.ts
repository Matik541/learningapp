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
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

// services
import { FlashcardsService } from './flashcards.service';

// guards
import { AuthorizationGuard } from '../auth/guards/auth.guard';

// entities
import { Flashcard } from './entities/flashcard.entity';

// decorators
import { LoginedUserDecorator } from '../auth/decorators/loginedUser.decorator';

// dtos
import { AddFlashcardDto } from './dto/addFlashcard.dto';
import { UpdateFlashcardDto } from './dto/updateFlashcard.dto';

@ApiBearerAuth()
@UseGuards(AuthorizationGuard)
@ApiTags('flashcards')
@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @ApiBody({ type: [AddFlashcardDto] })
  @Post(':lessonId')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Add a flashcards to lesson.',
  })
  addFlashcardsToLesson(
    @LoginedUserDecorator('sub') lessonCreatorId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body() addFlashcardsDto: AddFlashcardDto[],
  ): Promise<Flashcard[]> {
    return this.flashcardsService.addFlashcardsToLesson(
      lessonCreatorId,
      lessonId,
      addFlashcardsDto,
    );
  }

  @Put(':lessonId/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update flashcards in lesson.',
  })
  updateFlashcard(
    @LoginedUserDecorator('sub') lessonCreatorId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Param('id', ParseIntPipe) flashcardId: number,
    @Body() updateFlashcardsDto: UpdateFlashcardDto,
  ): Promise<Flashcard> {
    return this.flashcardsService.updateFlashcard(
      lessonCreatorId,
      lessonId,
      flashcardId,
      updateFlashcardsDto,
    );
  }

  @Delete(':lessonId/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete flashcard by id.',
  })
  removeFlashcard(
    @LoginedUserDecorator('sub') lessonCreatorId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Param('id', ParseIntPipe) flashcardId: number,
  ): Promise<Flashcard> {
    return this.flashcardsService.removeFlashcard(
      lessonCreatorId,
      lessonId,
      flashcardId,
    );
  }
}
