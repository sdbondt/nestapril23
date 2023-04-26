import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './Post';
import { UserModule } from '../user/user.module';
import { Comment } from '../comment/Comment';
import { CommentModule } from '../comment/comment.module';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [
    TypeOrmModule.forFeature([Post, Comment]),
    UserModule,
    CommentModule,
  ],
})
export class PostModule {}
