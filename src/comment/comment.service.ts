import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './Comment';
import { Repository } from 'typeorm';
import { User } from 'src/user/User';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async getComment(commentId: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user', 'post'],
    });
    if (!comment) throw new BadRequestException('No comment found.');
    return comment;
  }
  private authorizeUser(user: User, comment: Comment) {
    if (user.id !== comment.user.id)
      throw new UnauthorizedException(
        'You must be the commments creator to do this.',
      );
  }

  async updateComment(
    commentId: number,
    user: User,
    content: string,
  ): Promise<Comment> {
    const comment = await this.getComment(commentId);
    this.authorizeUser(user, comment);
    comment.content = content;
    await this.commentRepository.save(comment);
    return comment;
  }

  async deleteComment(commentId: number, user: User): Promise<void> {
    const comment = await this.getComment(commentId);
    this.authorizeUser(user, comment);
    this.commentRepository.remove(comment);
  }
}
