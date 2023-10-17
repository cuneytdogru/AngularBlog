import { BaseDto } from '../../api/baseDto';
import { PublicUserDto } from '../../user/publicUserDto';

export interface CommentDto extends BaseDto {
  text: string;
  postId: string;

  user: PublicUserDto;
}
