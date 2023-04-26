import {
  Controller,
  UseGuards,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { PostService } from './post.service';
import { Post as PostEntity } from './Post';
import { PostDto } from '../dtos/postDto';
import { GetUser } from '../decorators/userDecorator';
import { User } from '../user/User';
import { Comment } from '../comment/Comment';
import { CommentDto } from '../dtos/commentDto';

@Controller('posts')
@UseGuards(AuthGuard)
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  async createPost(
    @Body() { content }: PostDto,
    @GetUser() user: User,
  ): Promise<PostEntity> {
    const post = await this.postService.createPost(content, user);
    return post;
  }

  @Get('/:postId')
  async getPost(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<PostEntity> {
    const post = await this.postService.getPost(postId);
    return post;
  }

  @Get()
  async getPosts(): Promise<PostEntity[]> {
    const posts = await this.postService.getPosts();
    return posts;
  }

  @Patch('/:postId')
  async updatePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() { content }: PostDto,
    @GetUser() user: User,
  ): Promise<PostEntity> {
    const post = this.postService.updatePost(postId, user, content);
    return post;
  }

  @Delete('/:postId')
  async deletePost(
    @Param('postId', ParseIntPipe) postId: number,
    @GetUser() user: User,
  ): Promise<void> {
    await this.postService.deletePost(postId, user);
  }

  @Post('/:postId/comments')
  async createComment(
    @Body() { content }: CommentDto,
    @Param('postId', ParseIntPipe) postId: number,
    @GetUser() user: User,
  ): Promise<Comment> {
    const comment = await this.postService.createComment(postId, user, content);
    return comment;
  }

  @Get('/:postId/comments')
  async getComments(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<Comment[]> {
    const comments = await this.postService.getComments(postId);
    return comments;
  }
}
