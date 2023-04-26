import { Length } from 'class-validator';

export class CommentDto {
  @Length(1, 1000)
  content: string;
}
