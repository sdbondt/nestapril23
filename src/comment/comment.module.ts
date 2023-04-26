import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './Comment';
import { UserModule } from '../user/user.module';

@Module({
  providers: [CommentService],
  controllers: [CommentController],
  imports: [TypeOrmModule.forFeature([Comment]), UserModule],
  exports: [TypeOrmModule.forFeature([Comment])],
})
export class CommentModule {}
