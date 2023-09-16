import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// entities
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUserById(userId: number): Promise<User> {
    return await this.userRepository.findOneOrFail({
      select: {
        id: true,
        userName: true,
        email: true,
        createdLessons: true,
      },
      where: { id: userId },
      relations: { createdLessons: true },
    });
  }
}
