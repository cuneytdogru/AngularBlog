import { BaseDto } from '../api/baseDto';

export interface ProfileDto extends BaseDto {
  fullName: string;
  userName: string;
  description: string;
  totalPosts: number;
}
