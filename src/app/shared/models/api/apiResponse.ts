export interface ApiResponse<TResult> {
  result?: TResult;
  statusCode: number;
  isError: boolean;
  message?: string;
  errorMessage?: string;
  identifier?: string;
}
