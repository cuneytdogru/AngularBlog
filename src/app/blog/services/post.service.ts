import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import {
  ApiResponse,
  ApiResponseNoContent,
} from 'src/app/shared/models/api/apiResponse';
import { BaseDto } from 'src/app/shared/models/api/baseDto';
import { PagedResponse } from 'src/app/shared/models/api/pagedResponse';
import { CommentDto } from 'src/app/shared/models/blog/comment/commentDto';
import { CommentFilter } from 'src/app/shared/models/blog/comment/commentFilter';
import { CreatePostDto } from 'src/app/shared/models/blog/post/createPostDto';
import { LikePostDto } from 'src/app/shared/models/blog/post/likePostDto';
import { PostDto } from 'src/app/shared/models/blog/post/postDto';
import { PostFilter } from 'src/app/shared/models/blog/post/postFilter';
import { BASE_PATH } from 'src/app/shared/models/constants/base-path';
import { Append } from '../models/append.enum';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly apiPath: string = 'https://localhost';
  private readonly endpoint: string = 'post';

  private _posts = new BehaviorSubject<PostDto[]>([]);
  posts$ = this._posts.asObservable();

  constructor(
    private httpClient: HttpClient,
    @Inject(BASE_PATH) basePath: string,
    private authService: AuthService
  ) {
    this.apiPath = basePath;
    this.authService.isAuthenticated$.subscribe((authenticated) => {
      if (!authenticated) {
        this.clear();
      }
    });
  }

  private clear() {
    this.isInitialized = false;
    this._posts.next([]);
  }

  isInitialized = false;

  async getPosts(filter: PostFilter, append = Append.Bottom) {
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

    this.isInitialized = true;
    this.appendPosts(response!.result!.data);

    return response;
  }

  async getPost(id: string) {
    const response = await firstValueFrom(
      this.httpClient.get<ApiResponse<PostDto>>(
        `${this.apiPath}/${this.endpoint}/${encodeURIComponent(String(id))}`
      )
    );

    this.appendPost(response!.result!);

    return response;
  }

  async getPostFromLocation(location: string) {
    const response = await firstValueFrom(
      this.httpClient.get<ApiResponse<PostDto>>(location)
    );

    this.appendPost(response!.result!);

    return response;
  }

  async createPost(postDto: CreatePostDto): Promise<string | null> {
    const response = await firstValueFrom(
      this.httpClient.post<ApiResponseNoContent>(
        `${this.apiPath}/${this.endpoint}`,
        postDto,
        { observe: 'response' }
      )
    );

    return response.headers.get('location');
  }

  async likePost(post: PostDto, isLiked: boolean = true) {
    const likePostDto = { isLiked: isLiked } as LikePostDto;

    const response = await firstValueFrom(
      this.httpClient.put<ApiResponseNoContent>(
        `${this.apiPath}/${this.endpoint}/${encodeURIComponent(
          String(post.id)
        )}/like`,
        likePostDto
      )
    );

    post.isLiked = isLiked;

    this.appendPost(post);

    return response;
  }

  async getComments(postId: string, filter: CommentFilter) {
    let localVarQueryParameters = new HttpParams({});

    if (filter.showHidden !== undefined && filter.showHidden !== null) {
      localVarQueryParameters = localVarQueryParameters.append(
        'showHidden',
        filter.showHidden
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
      >(`${this.apiPath}/${this.endpoint}/${postId}/comments`, {
        params: localVarQueryParameters,
      })
    );

    return response;
  }

  private appendPost(data: PostDto) {
    this.appendPosts([data], Append.Bottom);
  }

  private appendPosts(data: PostDto[], append = Append.Bottom) {
    let values = [];
    if (append === Append.Top)
      values = this.unique([...data, ...this._posts.value]);
    else values = this.unique([...this._posts.value, ...data]);

    this._posts.next(this.sort(values));
  }

  private unique<T extends BaseDto>(data: T[]): T[] {
    return data.filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i);
  }

  private sort<T extends BaseDto>(data: T[]): T[] {
    return data.sort(
      (a, b) => +new Date(b.createdDate) - +new Date(a.createdDate)
    );
  }
}
