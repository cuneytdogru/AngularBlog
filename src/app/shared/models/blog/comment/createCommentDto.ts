import { BaseDto } from '../../api/baseDto';

export interface CreateCommentDto extends BaseDto {
  text: string;
}
