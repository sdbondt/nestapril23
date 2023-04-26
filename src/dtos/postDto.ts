import { Length } from 'class-validator';

export class PostDto {
  @Length(1, 1000)
  content: string;
}
