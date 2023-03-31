import { BaseFilter } from './baseFilter';

export class EmptyFilter implements BaseFilter {
  skip?: number;
  take?: number;

  constructor() {
    this.skip = 0;
    this.take = 5;
  }
}
