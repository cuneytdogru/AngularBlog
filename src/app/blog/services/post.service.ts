import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StoreKeys } from 'src/app/core/models/store.model';
import { StoreService } from 'src/app/core/store.service';
import { UserService } from 'src/app/core/user.service';
import {
  ApiResponse,
  ApiResponseNoContent,
} from 'src/app/shared/models/api/apiResponse';
import { BaseDto } from 'src/app/shared/models/api/baseDto';
import { PagedResponse } from 'src/app/shared/models/api/pagedResponse';
import { CommentDto } from 'src/app/shared/models/blog/comment/commentDto';
import { CommentFilter } from 'src/app/shared/models/blog/comment/commentFilter';
import { CreateCommentDto } from 'src/app/shared/models/blog/comment/createCommentDto';
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

  constructor(
    private httpClient: HttpClient,
    @Inject(BASE_PATH) basePath: string,
    private storeService: StoreService,
    private userService: UserService
  ) {
    this.apiPath = basePath;
  }

  posts$ = this.storeService.select<PostDto[]>(StoreKeys.Posts);

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

  async getCommentFromLocation(location: string) {
    const response = await firstValueFrom(
      this.httpClient.get<ApiResponse<CommentDto>>(location)
    );

    this.appendComment(response!.result!.postId, response!.result!);

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

  async deletePost(id: string) {
    const response = await firstValueFrom(
      this.httpClient.delete<ApiResponseNoContent>(
        `${this.apiPath}/${this.endpoint}/${encodeURIComponent(String(id))}`
      )
    );

    this.removePost(id);

    return response;
  }

  async addComment(postId: string, comment: CreateCommentDto) {
    const response = await firstValueFrom(
      this.httpClient.post<ApiResponseNoContent>(
        `${this.apiPath}/${this.endpoint}/${encodeURIComponent(
          String(postId)
        )}/comments`,
        comment,
        { observe: 'response' }
      )
    );

    return response.headers.get('location');
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

    this.appendComments(postId, response!.result!.data);

    return response;
  }

  private appendComment(postId: string, comment: CommentDto) {
    this.appendComments(postId, [comment]);
  }

  private async appendComments(postId: string, comments: CommentDto[]) {
    this.storeService.set(
      StoreKeys.Posts,
      this.storeService.value.posts.map((post) => {
        if (post.id != postId) {
          return post;
        } else {
          const values = this.unique([...comments, ...post.comments]);

          post.comments = this.sort(values);

          return post;
        }
      })
    );
  }

  private appendPost(data: PostDto) {
    this.appendPosts([data], Append.Bottom);
  }

  private appendPosts(data: PostDto[], append = Append.Bottom) {
    const values = this.unique([...data, ...this.storeService.value.posts]);

    this.storeService.set(StoreKeys.Posts, this.sort(values));
  }

  private removePost(id: string) {
    this.storeService.set(
      StoreKeys.Posts,
      this.storeService.value.posts.filter((x) => x.id != id)
    );
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
