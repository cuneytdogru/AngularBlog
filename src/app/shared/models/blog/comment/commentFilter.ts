import { BaseFilter } from '../../api/baseFilter';

export interface CommentFilter extends BaseFilter {
  showHidden?: boolean;
}
