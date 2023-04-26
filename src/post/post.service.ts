import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './Post';
import { Repository } from 'typeorm';
import { User } from '../user/User';
import { Comment } from '../comment/Comment';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  private userIsAuthorized(user: User, post: Post) {
    if (post.user.id !== user.id)
      throw new UnauthorizedException(
        'You must be the posts creator to do this.',
      );
  }

  async createPost(content: string, user: User): Promise<Post> {
    const post = this.postRepository.create({ content, user });
    await this.postRepository.save(post);
    return post;
  }

  async getPost(postId: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user', 'comments'],
    });
    if (!post) throw new BadRequestException('No post found.');
    return post;
  }

  async getPosts(): Promise<Post[]> {
    const posts = await this.postRepository.find();
    return posts;
  }

  async updatePost(postId: number, user: User, content: string): Promise<Post> {
    const post = await this.getPost(postId);
    this.userIsAuthorized(user, post);
    post.content = content;
    await this.postRepository.save(post);
    return post;
  }

  async deletePost(postId: number, user: User): Promise<void> {
    const post = await this.getPost(postId);
    this.userIsAuthorized(user, post);
    await this.postRepository.remove(post);
  }

  async createComment(
    postId: number,
    user: User,
    content: string,
  ): Promise<Comment> {
    const post = await this.getPost(postId);
    const comment = this.commentRepository.create({
      content,
      post,
      user,
    });
    await this.commentRepository.save(comment);
    return comment;
  }

  async getComments(postId: number): Promise<Comment[]> {
    const post = await this.getPost(postId);
    return post.comments;
  }
}
