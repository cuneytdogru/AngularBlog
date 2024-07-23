import { BaseDto } from '../api/baseDto';

export interface UserDto extends BaseDto {
  fullName: string;
  userName: string;
  email: string;
}
