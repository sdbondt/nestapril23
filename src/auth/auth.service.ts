import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../user/User';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto, SignupDto } from 'src/dtos/authDto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signup({ email, username, password }: SignupDto): Promise<string> {
    const emailAlreadyExists = await this.userRepository.findOne({
      where: { email },
    });
    if (emailAlreadyExists) throw new BadRequestException('Invalid request.');
    const user = this.userRepository.create({
      username,
      password,
      email,
    });
    await this.userRepository.save(user);
    return user.getJWT();
  }

  async login({ email, password }: LoginDto): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) throw new BadRequestException('Invalid credentials.');
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) throw new BadRequestException('Invalid credentials.');
    return user.getJWT();
  }
}
