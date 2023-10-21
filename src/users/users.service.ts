import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';

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
  ) {}

  async getMe(userId: number): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({
        select: { ...this.userSelect, lessonsCompleted: true },
        where: { id: userId },
        relations: { ...this.userRelationships, lessonsCompleted: true },
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async getUserById(userId: number): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({
        select: this.userSelect,
        where: { id: userId },
        relations: this.userRelationships,
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
