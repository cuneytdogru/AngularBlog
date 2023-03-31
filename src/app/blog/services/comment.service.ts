import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { PagedResponse } from 'src/app/shared/models/api/pagedResponse';
import { ApiResponse } from 'src/app/shared/models/api/apiResponse';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { BASE_PATH } from 'src/app/shared/models/constants/base-path';
import { CommentDto } from 'src/app/shared/models/blog/comment/commentDto';
import { CommentFilter } from 'src/app/shared/models/blog/comment/commentFilter';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly apiPath: string = 'https://localhost';
  private readonly endpoint: string = 'comment';

  _comments = new BehaviorSubject<CommentDto[]>([]);
  comments$ = this._comments.asObservable();

  constructor(
    private httpClient: HttpClient,
    @Inject(BASE_PATH) basePath: string
  ) {
    this.apiPath = basePath;
  }

  clear() {
    this._comments.next([]);
  }

  isInitialized = false;

  async getComments(filter: CommentFilter) {
    let localVarQueryParameters = new HttpParams({});

    if (filter.postId !== undefined && filter.postId !== null) {
      localVarQueryParameters = localVarQueryParameters.append(
        'postId',
        filter.postId
      );
    }

    if (filter.skip !== undefined && filter.skip !== null) {
      localVarQueryParameters = localVarQueryParameters.append(
        'skip',
        filter.skip
      );
    }
    if (filter.take !== undefined && filter.take !== null) {
      localVarQueryParameters = localVarQueryParameters.append(
        'take',
        filter.take
      );
    }
    if (filter.orderBy !== undefined && filter.orderBy !== null) {
      localVarQueryParameters = localVarQueryParameters.append(
        'orderBy',
        filter.orderBy
      );
    }

    const response = await firstValueFrom(
      this.httpClient.get<
        ApiResponse<PagedResponse<CommentDto, CommentFilter>>
      >(`${this.apiPath}/${this.endpoint}`, {
        params: localVarQueryParameters,
      })
    );

    if (
      response &&
      !response.isError &&
      response.result &&
      response.result.data
    ) {
      this.isInitialized = true;
      this.appendPosts(response.result.data);
    } else console.log('Error occured: ' + response.errorMessage, response);

    return response;
  }

  appendPosts(data: CommentDto[]) {
    const values = [...this._comments.value, ...data];

    this._comments.next(values);
  }
}
