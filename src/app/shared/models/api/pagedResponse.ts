export interface PagedResponse<TDto, TFilter> {
  data: TDto[];
  filter: TFilter;
  dataCount: number;
  totalCount: number;
}
