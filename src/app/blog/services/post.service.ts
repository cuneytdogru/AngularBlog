import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { PostDto } from 'src/app/shared/models/blog/post/postDto';
import { PagedResponse } from 'src/app/shared/models/api/pagedResponse';
import { PostFilter } from 'src/app/shared/models/blog/post/postFilter';
import { ApiResponse } from 'src/app/shared/models/api/apiResponse';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { BASE_PATH } from 'src/app/shared/models/constants/base-path';
import { LikePostDto } from 'src/app/shared/models/blog/post/likePostDto';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly apiPath: string = 'https://localhost';
  private readonly endpoint: string = 'post';

  _posts = new BehaviorSubject<PostDto[]>([]);
  posts$ = this._posts.asObservable();

  constructor(
    private httpClient: HttpClient,
    @Inject(BASE_PATH) basePath: string
  ) {
    this.apiPath = basePath;
  }

  clear() {
    this._posts.next([]);
  }

  isInitialized = false;

  async getPosts(filter: PostFilter) {
    let localVarQueryParameters = new HttpParams({});

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
      this.httpClient.get<ApiResponse<PagedResponse<PostDto, PostFilter>>>(
        `${this.apiPath}/${this.endpoint}`,
        {
          params: localVarQueryParameters,
        }
      )
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

  async getPost(id: string) {
    const response = await firstValueFrom(
      this.httpClient.get<ApiResponse<PostDto>>(
        `${this.apiPath}/${this.endpoint}/${encodeURIComponent(String(id))}`
      )
    );

    if (response && !response.isError && response.result)
      this.appendPost(response.result);
    else console.log('Error occured: ' + response.errorMessage, response);

    return response;
  }

  async likePost(post: PostDto, isLiked: boolean = true) {
    const likePostDto = { isLiked: isLiked } as LikePostDto;

    const response = await firstValueFrom(
      this.httpClient.put<ApiResponse<PostDto>>(
        `${this.apiPath}/${this.endpoint}/${encodeURIComponent(
          String(post.id)
        )}/Like`,
        likePostDto
      )
    );

    if (response && !response.isError && response.result)
      this.appendPost(response.result);
    else console.log('Error occured: ' + response.errorMessage, response);

    return response;
  }

  appendPost(data: PostDto) {
    this.appendPosts([data]);
  }
  appendPosts(data: PostDto[]) {
    const values = this.unique([...this._posts.value, ...data]);

    this._posts.next(this.sort(values));
  }

  private unique(data: PostDto[]) {
    return data.filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i);
  }

  private sort(data: PostDto[]) {
    return data.sort((a, b) => +b.createdDate - +a.createdDate);
  }
}
