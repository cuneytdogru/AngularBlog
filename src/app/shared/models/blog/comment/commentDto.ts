import { BaseDto } from '../../api/baseDto';

export interface CommentDto extends BaseDto {
  text: string;
  fullName: string;
  postId: string;
}
