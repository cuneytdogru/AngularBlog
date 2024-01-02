import { BaseFilter } from '../../api/baseFilter';

export interface CommentFilter extends BaseFilter {
  showHidden?: boolean;
}

export class CommentFilter implements BaseFilter {
  constructor(
    skip?: number,
    take?: number,
    orderBy?: string,
    showHidden?: boolean
  ) {
    this.skip = skip;
    this.take = take;
    this.orderBy = orderBy;

    this.showHidden = showHidden;
  }

  skip?: number;
  take?: number;
  orderBy?: string;

  showHidden?: boolean;
}
