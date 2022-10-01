import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// entity
import { User } from 'src/users/entities/user.entity';

// dto
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const user = await this.userRepository.create(signUpDto);

    return await this.userRepository.save(user);
  }
}
