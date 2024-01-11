import { BaseDto } from '../api/baseDto';

export interface PublicUserDto extends BaseDto {
  fullName: string;
  userName: string;
}
