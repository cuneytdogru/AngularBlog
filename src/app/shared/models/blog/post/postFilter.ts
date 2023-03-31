import { BaseFilter } from '../../api/baseFilter';

export interface PostFilter extends BaseFilter {
  owner?: string;
}
