import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';

// services
import { LessonsService } from '../lessons/lessons.service';

// entities
import { Flashcard } from './entities/flashcard.entity';

// dto
import { AddFlashcardDto } from './dto/addFlashcard.dto';
import { UpdateFlashcardDto } from './dto/updateFlashcard.dto';

@Injectable()
export class FlashcardsService {
  constructor(
    @InjectRepository(Flashcard)
    private readonly flashcardRepository: Repository<Flashcard>,

    // TODO: change on event
    private readonly lessonsService: LessonsService,
  ) {}

  @OnEvent('flashcards.add')
  async addFlashcardsToLesson(
    lessonCreatorId: number,
    lessonId: number,
    flashcardsData: AddFlashcardDto[],
  ): Promise<Flashcard[]> {
    const lesson = await this.lessonsService.getLessonById(lessonId);

    if (lesson.creator.id !== lessonCreatorId)
      throw new BadRequestException('Invalid user');

    const flashcards: Flashcard[] = flashcardsData.map((card) => {
      return this.flashcardRepository.create({
        question: card.question,
        answer: card.answer,
        lesson: { id: lessonId },
      });
    });

    try {
      return await this.flashcardRepository.save(flashcards);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async updateFlashcard(
    lessonCreatorId: number,
    lessonId: number,
    flashcardId: number,
    updateFlashcardDto: UpdateFlashcardDto,
  ): Promise<Flashcard> {
    const lesson = await this.lessonsService.getLessonById(lessonId);

    if (lesson.creator.id !== lessonCreatorId)
      throw new BadRequestException('Invalid user');

    try {
      let flashcard = await this.flashcardRepository.findOneOrFail({
        where: { id: flashcardId },
      });

      flashcard = {
        ...flashcard,
        question: updateFlashcardDto.question,
        answer: updateFlashcardDto.answer,
      };

      return await this.flashcardRepository.save(flashcard);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async removeFlashcard(
    lessonCreatorId: number,
    lessonId: number,
    flashcardId: number,
  ): Promise<Flashcard> {
    const lesson = await this.lessonsService.getLessonById(lessonId);

    if (lesson.creator.id !== lessonCreatorId)
      throw new BadRequestException('Invalid user');

    try {
      const flashcard = await this.flashcardRepository.findOneOrFail({
        where: { id: flashcardId },
      });

      return await this.flashcardRepository.remove(flashcard);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @OnEvent('flashcards.delete_all')
  private async removeLessonsFlashcards(
    lessonId: number,
  ): Promise<Flashcard[]> {
    try {
      const flashcards = await this.flashcardRepository.find({
        where: { lesson: { id: lessonId } },
      });

      return await this.flashcardRepository.remove(flashcards);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
