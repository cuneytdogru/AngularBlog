import { BaseFilter } from '../../api/baseFilter';

export interface CommentFilter extends BaseFilter {
  showHidden?: boolean;
}

export class CommentFilter implements BaseFilter {
  constructor(
    skip?: number,
    take?: number,
    orderBy?: string,
    showHidden?: boolean,
    userId?: string,
    userName?: string
  ) {
    this.skip = skip;
    this.take = take;
    this.orderBy = orderBy;

    this.showHidden = showHidden;
    this.userId = userId;
    this.userName = userName;
  }

  skip?: number;
  take?: number;
  orderBy?: string;

  showHidden?: boolean;
  userId?: string;
  userName?: string;
}
