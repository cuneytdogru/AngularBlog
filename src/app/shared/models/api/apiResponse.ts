export interface ApiResponse<TResult> extends BaseApiResponse {
  result?: TResult;
}

export interface ApiResponseNoContent extends BaseApiResponse {}

export interface BaseApiResponse {
  statusCode: number;
  isError: boolean;
  message?: string;
  errorMessage?: string;
  identifier?: string;
}
