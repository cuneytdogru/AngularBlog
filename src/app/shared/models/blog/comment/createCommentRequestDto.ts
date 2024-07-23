import { BaseDto } from '../../api/baseDto';

export interface CreateCommentRequestDto extends BaseDto {
  text: string;
}
