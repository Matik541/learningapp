import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// entity
import { User } from 'src/users/entities/user.entity';

// dto
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const user = await this.userRepository.create(signUpDto);

    return await this.userRepository.save(user);
  }

  async signIn(signInDto: SignInDto): Promise<User> {
    const user = await this.userRepository.findOneOrFail({
      where: {
        email: signInDto.email,
        hashedPassword: signInDto.hashedPassword,
      },
    });

    delete user.hashedPassword;

    return user;
  }
}
