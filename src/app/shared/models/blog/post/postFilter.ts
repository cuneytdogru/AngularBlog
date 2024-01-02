import { BaseFilter } from '../../api/baseFilter';

export class PostFilter implements BaseFilter {
  constructor(
    skip?: number,
    take?: number,
    orderBy?: string,
    userId?: string,
    userName?: string,
    likedByUserName?: string
  ) {
    this.skip = skip;
    this.take = take;
    this.orderBy = orderBy;

    this.userId = userId;
    this.userName = userName;
    this.likedByUserName = likedByUserName;
  }

  skip?: number;
  take?: number;
  orderBy?: string;

  userId?: string;
  userName?: string;
  likedByUserName?: string;
}
