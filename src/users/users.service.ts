import { NotFoundException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';

// entities
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly userSelect: FindOptionsSelect<User> = {
    id: true,
    userName: true,
    email: true,
    createdLessons: true,
    comments: true,
  };

  private readonly userRelationships: FindOptionsRelations<User> = {
    createdLessons: true,
    comments: true,
  };

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly logger: Logger,
  ) {}

  async getMe(userId: number): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({
        select: { ...this.userSelect, lessonsCompleted: true },
        where: { id: userId },
        relations: { ...this.userRelationships, lessonsCompleted: true },
      });
    } catch (err) {
      this.logger.error(err);

      throw new NotFoundException(`Could not find user with id ${userId}.`);
    }
  }

  @OnEvent('users.get_by_id')
  async getUserById(userId: number): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({
        select: this.userSelect,
        where: { id: userId },
        relations: this.userRelationships,
      });
    } catch (err) {
      this.logger.error(err);

      throw new NotFoundException(`Could not find user with id ${userId}.`);
    }
  }
}
