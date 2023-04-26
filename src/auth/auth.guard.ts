import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from '../user/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

interface jwtPayload {
  userId: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split('Bearer ')[1];
    // eslint-disable-next-line prettier/prettier
    if (!token) throw new UnauthorizedException('You must be logged in to do this.');
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET) as jwtPayload;
      // eslint-disable-next-line prettier/prettier
      if (!payload || !payload.userId) throw new UnauthorizedException('You must be logged in to do this.');
      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
      });
      // eslint-disable-next-line prettier/prettier
      if (!user) throw new UnauthorizedException()
      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('You must be logged in to do this.');
    }
  }
}
