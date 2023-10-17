import { BaseDto } from '../../api/baseDto';
import { PublicUserDto } from '../../user/publicUserDto';
import { CommentDto } from '../comment/commentDto';

export interface PostDto extends BaseDto {
  text: string;
  imageURL: string;
  isLikedByCurrentUser: boolean;
  totalLikes: number;
  totalComments: number;

  comments: CommentDto[];
  user: PublicUserDto;
}
