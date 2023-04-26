import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  ParseIntPipe,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Comment } from './Comment';
import { CommentService } from './comment.service';
import { GetUser } from '../decorators/userDecorator';
import { User } from '../user/User';
import { CommentDto } from '../dtos/commentDto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('comments/:commentId')
export class CommentController {
  constructor(private commentService: CommentService) {}
  @Get()
  async getComment(
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<Comment> {
    const comment = await this.commentService.getComment(commentId);
    return comment;
  }

  @Patch()
  async updateComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @GetUser() user: User,
    @Body() { content }: CommentDto,
  ): Promise<Comment> {
    const comment = await this.commentService.updateComment(
      commentId,
      user,
      content,
    );
    return comment;
  }

  @Delete()
  async deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @GetUser() user: User,
  ): Promise<void> {
    await this.commentService.deleteComment(commentId, user);
  }
}
