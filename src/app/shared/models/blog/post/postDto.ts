import { BaseDto } from '../../api/baseDto';
import { CommentDto } from '../comment/commentDto';

export interface PostDto extends BaseDto {
  text: string;
  imageURL: string;
  fullName: string;
  likes: number;
  totalComments: number;

  comments: CommentDto[];
}
